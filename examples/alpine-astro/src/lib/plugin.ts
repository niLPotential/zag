import type { Alpine } from "alpinejs"
import { useMachine } from "./machine"
import { normalizeProps } from "./normalize-props"

export function usePlugin(name: string, component: any) {
  return function (Alpine: Alpine) {
    Alpine.directive(name, (el, { expression, value }, { cleanup, effect, evaluateLater }) => {
      if (!value) {
        const evaluateProps = evaluateLater(expression)
        const propsRef = Alpine.reactive({ value: {} as any })
        evaluateProps((value) => (propsRef.value = value))
        const service = useMachine(component.machine, propsRef)
        Alpine.bind(el, {
          "x-data"() {
            return {
              api: component.connect(service, normalizeProps),
              init() {
                queueMicrotask(() => {
                  effect(() => {
                    evaluateProps((value: any) => (propsRef.value = value))
                    this.api = component.connect(service, normalizeProps)
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
          cleanupBinding = Alpine.bind(el, (Alpine.$data(el) as any).api[getProps](props))
        })
        cleanup(() => {
          cleanupBinding()
        })
      }
    })
    Alpine.magic(name, (el) => (Alpine.$data(el) as any).api)
  }
}
