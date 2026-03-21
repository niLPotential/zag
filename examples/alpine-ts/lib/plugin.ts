import type { Machine, MachineSchema, Service } from "@zag-js/core"
import type { NormalizeProps, PropTypes } from "@zag-js/types"
import type { Alpine } from "alpinejs"
import { AlpineMachine } from "./machine"
import { normalizeProps } from "./normalize-props"
import { joinCamelCase } from "./utils"

function useEvaluator<T>(evaluator: (callback: (value: T) => void) => void) {
  return <R>(fn: (value: T) => R) => {
    let result
    evaluator((value) => (result = fn(value)))
    return result as R
  }
}

export function usePlugin<T extends MachineSchema>(
  name: string,
  component: {
    machine: Machine<T>
    connect: (service: Service<T>, normalizeProps: NormalizeProps<PropTypes>) => any
    collection?: (options: any) => any
    gridCollection?: (options: any) => any
  },
) {
  return function (Alpine: Alpine) {
    Alpine.directive(name, (el, { expression, value, modifiers }, { evaluateLater }) => {
      const apiName = joinCamelCase([...name.split("-"), modifiers.at(0) ?? ""])
      if (!value) {
        const evaluateProps = evaluateLater<Partial<T["props"]> | (() => Partial<T["props"]>)>(expression)
        const userPropsRef = Alpine.reactive({ value: {} as Partial<T["props"]> | (() => Partial<T["props"]>) })
        evaluateProps((props) => (userPropsRef.value = props))

        const machine = new AlpineMachine(component.machine, userPropsRef)
        Alpine.magic(apiName + "Service", () => machine.service)
        Alpine.magic(apiName, () => component.connect(machine.service, normalizeProps))
        Alpine.bind(el, {
          "x-data"() {
            return {
              init() {
                machine.init()
              },
              destroy() {
                machine.destroy()
              },
            }
          },
          "x-effect"() {
            evaluateProps((props) => (userPropsRef.value = props))
          },
        })
      } else if (value === "collection") {
        const evaluateCollection = evaluateLater(expression)
        Alpine.bind(el, {
          "x-data"() {
            return {
              collection: null,
            }
          },
          "x-effect"() {
            evaluateCollection((options) => {
              ;(this as any).collection = component.collection?.(options)
            })
          },
        })
      } else if (value === "grid-collection") {
        const evaluateCollection = evaluateLater(expression)
        Alpine.bind(el, {
          "x-data"() {
            return {
              collection: null,
            }
          },
          "x-effect"() {
            evaluateCollection((options) => {
              ;(this as any).collection = component.gridCollection?.(options)
            })
          },
        })
      } else {
        const getPartProps = joinCamelCase(["get", ...value.split("-"), "props"])

        const evaluateProps = evaluateLater(expression || "{}")
        const usePartProps = useEvaluator(evaluateProps)

        Alpine.bind(el, () => {
          const propsRef = Alpine.reactive(
            usePartProps((props) => (Alpine.$data(el) as any)["$" + apiName][getPartProps](props)),
          ) as Record<string, any>

          return {
            ...Object.keys(propsRef).reduce((acc: Record<string, any>, prop) => {
              const { key, value } = prop.startsWith("on")
                ? { key: "@" + prop.substring(2), value: (...args: any[]) => propsRef[prop](...args) }
                : { key: (prop === "x-html" ? "" : ":") + prop, value: () => propsRef[prop] }
              acc[key] = value
              return acc
            }, {}),
            "x-effect"() {
              evaluateProps((props) => {
                Object.assign(propsRef, (this as any)["$" + apiName][getPartProps](props))
              })
            },
          }
        })
      }
    }).before("bind")
  }
}
