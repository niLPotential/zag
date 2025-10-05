import type { Alpine, ElementWithXAttributes } from "alpinejs"
import type { Machine, MachineSchema, Service } from "@zag-js/core"
import type { NormalizeProps, PropTypes } from "@zag-js/types"
import { AlpineMachine, normalizeProps } from "./lib"

export function createZagPlugin<T extends MachineSchema>(
  name: string,
  component: {
    machine: Machine<T>
    connect: (service: Service<T>, normalizeProps: NormalizeProps<PropTypes>) => any
  },
) {
  const api = `_${name.replaceAll("-", "_")}_api`
  const bindings = `_${name.replaceAll("-", "_")}_bindings`

  return function (Alpine: Alpine) {
    Alpine.directive(name, (el, { expression, value }, { evaluateLater }) => {
      if (!value) {
        const service = new AlpineMachine(component.machine, evaluateLater(expression))
        Alpine.bind(el, {
          "x-data"() {
            return {
              [api]: component.connect(service, normalizeProps),
              [bindings]: [] as {
                el: ElementWithXAttributes
                getProps: string
                evaluateProps: ((callback: (value: any) => void) => void) | null
                cleanup: (() => void) | null
              }[],
              init() {
                queueMicrotask(() => {
                  Alpine.effect(() => {
                    this[api] = component.connect(service, normalizeProps)

                    for (const binding of this[bindings]) {
                      binding.cleanup?.()
                      if (binding.evaluateProps) {
                        binding.evaluateProps((props: any) => {
                          binding.cleanup = Alpine.bind(binding.el, this[api][binding.getProps](props))
                        })
                      } else {
                        binding.cleanup = Alpine.bind(binding.el, this[api][binding.getProps])
                      }
                    }
                  })
                })
                service.init()
              },
            }
          },
        })
      } else {
        ;(Alpine.$data(el) as any)[bindings].push({
          el,
          getProps: `get${value
            .split("-")
            .map((v) => v.at(0)?.toUpperCase() + v.substring(1).toLowerCase())
            .join("")}Props`,
          evaluateProps: expression ? evaluateLater(expression) : null,
          cleanup: null,
        })
      }
    }).before("bind")

    Alpine.magic(
      name
        .split("-")
        .map((str, i) => (i === 0 ? str : str.at(0)?.toUpperCase() + str.substring(1).toLowerCase()))
        .join(""),
      (el) => (Alpine.$data(el) as any)[api],
    )
  }
}
