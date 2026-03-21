import type { Machine, MachineSchema, Service } from "@zag-js/core"
import type { NormalizeProps, PropTypes } from "@zag-js/types"
import type { Alpine } from "alpinejs"
import { AlpineMachine } from "./machine"
import { normalizeProps } from "./normalize-props"
import { joinCamelCase } from "./utils"

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

        Alpine.bind(el, () => {
          const propsMap = new Map<string, { value: any }>()
          evaluateProps((props) => {
            const partProps = (Alpine.$data(el) as any)["$" + apiName][getPartProps](props)
            for (const prop in partProps) {
              propsMap.set(prop, Alpine.reactive({ value: partProps[prop] }))
            }
          })

          return {
            ...propsMap.keys().reduce(
              (acc, prop) => {
                const { key, value } = prop.startsWith("on")
                  ? { key: "@" + prop.substring(2), value: (...args: any[]) => propsMap.get(prop)?.value(...args) }
                  : { key: (prop === "x-html" ? "" : ":") + prop, value: () => propsMap.get(prop)?.value }
                acc[key] = value
                return acc
              },
              {} as Record<string, any>,
            ),
            "x-effect"() {
              evaluateProps((props) => {
                const partProps = (Alpine.$data(el) as any)["$" + apiName][getPartProps](props)
                for (const prop in partProps) {
                  if (prop.startsWith("on") || partProps[prop] !== propsMap.get(prop)?.value) {
                    propsMap.get(prop)!.value = partProps[prop]
                  }
                }
              })
            },
          }
        })
      }
    }).before("bind")
  }
}
