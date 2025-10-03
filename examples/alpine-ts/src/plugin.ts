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
  return function (Alpine: Alpine) {
    const elementBindings: [
      ElementWithXAttributes,
      string,
      ((callback: (prpos: Partial<T["props"]>) => void) => void) | undefined,
    ][] = []

    Alpine.directive(name, (el, { expression, value }, { evaluateLater }) => {
      if (!value) {
        const service = new AlpineMachine(component.machine, evaluateLater(expression))
        Alpine.bind(el, {
          "x-data"() {
            return {
              __api: component.connect(service, normalizeProps),
              init() {
                // wait a tick for Alpine to track all bindings
                queueMicrotask(() => {
                  Alpine.effect(() => {
                    this.__api = component.connect(service, normalizeProps)
                    for (const [element, getProps, evaluateProps] of elementBindings) {
                      let props
                      evaluateProps?.((p) => (props = p))
                      Alpine.bind(element, this.__api[getProps](props))
                    }
                  })
                })
                service.init()
              },
            }
          },
        })
      } else {
        elementBindings.push([
          el,
          `get${value
            .split("-")
            .map((v) => v.at(0)?.toUpperCase() + v.substring(1).toLowerCase())
            .join("")}Props`,
          expression ? evaluateLater(expression) : undefined,
        ])
      }
    }).before("bind")

    Alpine.magic(
      name
        .split("-")
        .map((str, i) => (i === 0 ? str : str.at(0)?.toUpperCase() + str.substring(1).toLowerCase()))
        .join(""),
      (el) => {
        const { __api } = Alpine.$data(el) as { __api: any }

        return __api
      },
    )
  }
}
