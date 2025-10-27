import type { Machine, MachineSchema, Service } from "@zag-js/core"
import type { NormalizeProps, PropTypes } from "@zag-js/types"
import type { Alpine } from "alpinejs"
import { useMachine } from "./machine"
import { normalizeProps } from "./normalize-props"

export function usePlugin<T extends MachineSchema>(
  name: string,
  component: {
    machine: Machine<T>
    connect: (service: Service<T>, normalizeProps: NormalizeProps<PropTypes>) => any
    collection?: (options: any) => any
  },
) {
  const api = `_x_${name.replaceAll("-", "_")}_api` as const

  return function (Alpine: Alpine) {
    Alpine.directive(name, (el, { expression, value }, { cleanup, effect, evaluateLater }) => {
      if (!value) {
        const evaluateProps = evaluateLater(expression)
        const propsRef = Alpine.reactive({ value: {} as T["props"] })
        evaluateProps((value: any) => (propsRef.value = value))
        const service = useMachine(component.machine, propsRef)
        Alpine.bind(el, {
          "x-data"() {
            return {
              service, // dev only for state visualization
              [api]: component.connect(service, normalizeProps),
              init() {
                queueMicrotask(() => {
                  effect(() => {
                    evaluateProps((value: any) => (propsRef.value = value))
                    this[api] = component.connect(service, normalizeProps)
                  })
                })
                service.init()
              },
              destroy() {
                service.destroy()
              },
            }
          },
        })
      } else if (value === "collection") {
        const evaluateCollection = evaluateLater(expression)
        const cleanupBinding = Alpine.bind(el, {
          "x-data"() {
            return {
              get collection() {
                let options: any = {}
                evaluateCollection((value) => (options = value))
                return component.collection?.(options)
              },
            }
          },
        })
        cleanup(() => cleanupBinding())
      } else {
        const getProps = `get${value
          .split("-")
          .map((v) => v.at(0)?.toUpperCase() + v.substring(1).toLowerCase())
          .join("")}Props`
        const evaluateProps = expression ? evaluateLater(expression) : null
        let cleanupBinding = () => {}
        effect(() => {
          cleanupBinding()
          let props = {}
          evaluateProps && evaluateProps((value: any) => (props = value))
          cleanupBinding = Alpine.bind(el, (Alpine.$data(el) as any)[api][getProps](props))
        })
        cleanup(() => {
          cleanupBinding()
        })
      }
    })
    Alpine.magic(
      name
        .split("-")
        .map((str, i) => (i === 0 ? str : str.at(0)?.toUpperCase() + str.substring(1).toLowerCase()))
        .join(""),
      (el) => (Alpine.$data(el) as any)[api],
    )
  }
}
