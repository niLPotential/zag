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
  const _x_snake_case = "_x_" + name.replaceAll("-", "_")

  return function (Alpine: Alpine) {
    Alpine.directive(name, (el, { expression, value, modifiers }, { effect, evaluateLater }) => {
      const modifier = modifiers.at(0)
      const _modifier = modifier ? "_" + modifier : ""
      if (!value) {
        const evaluateProps = evaluateLater<Partial<T["props"]> | (() => Partial<T["props"]>)>(expression)
        const userPropsRef = Alpine.reactive({ value: {} as Partial<T["props"]> | (() => Partial<T["props"]>) })
        effect(() => {
          evaluateProps((props) => (userPropsRef.value = props))
        })
        const machine = new AlpineMachine(component.machine, userPropsRef)
        Alpine.magic(joinCamelCase([...name.split("-"), modifier ?? "", "service"]), () => machine.service)
        Alpine.bind(el, {
          "x-data"() {
            return {
              [_x_snake_case + _modifier]: component.connect(machine.service, normalizeProps),
              init() {
                machine.init()
              },
              destroy() {
                machine.destroy()
              },
            }
          },
          "x-effect"() {
            ;(this as any)[_x_snake_case + _modifier] = component.connect(machine.service, normalizeProps)
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
        const getPartProps = `get${value
          .split("-")
          .map((v) => v.at(0)?.toUpperCase() + v.substring(1).toLowerCase())
          .join("")}Props`

        const evaluateProps = evaluateLater(expression || "{}")
        const usePartProps = useEvaluator(evaluateProps)

        Alpine.bind(el, () => {
          const propsRef = Alpine.reactive(
            usePartProps((props) => (Alpine.$data(el) as any)[_x_snake_case + _modifier][getPartProps](props)),
          ) as Record<string, any>

          return {
            ...Object.keys(propsRef).reduce((acc: Record<string, any>, prop) => {
              const { key, value } =
                prop === "x-html"
                  ? { key: "x-html", value: () => propsRef[prop] }
                  : prop.startsWith("on")
                    ? { key: "@" + prop.substring(2), value: (...args: any[]) => propsRef[prop]?.(...args) }
                    : { key: ":" + prop, value: () => propsRef[prop] }
              acc[key] = value
              return acc
            }, {}),
            "x-effect"() {
              evaluateProps((props) => {
                Object.assign(propsRef, (this as any)[_x_snake_case + _modifier][getPartProps](props))
              })
            },
          }
        })
      }
    }).before("bind")
    Alpine.magic(
      name
        .split("-")
        .map((str, i) => (i === 0 ? str : str.at(0)?.toUpperCase() + str.substring(1).toLowerCase()))
        .join(""),
      () => {
        return function (modifier?: string) {
          // @ts-ignore
          return (this as any)[_x_snake_case + (modifier ? "_" + modifier : "")]
        }
      },
    )
  }
}
