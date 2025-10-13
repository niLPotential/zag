import type { Alpine } from "alpinejs"
import type { Machine, MachineSchema, Service } from "@zag-js/core"
import type { NormalizeProps, PropTypes } from "@zag-js/types"
import type { ListCollection, CollectionItem, CollectionOptions } from "@zag-js/collection"
import { AlpineMachine } from "./machine"
import { normalizeProps } from "./normalize-props"

// Dev only
import { highlightState } from "@zag-js/stringify-state"

export function createZagPlugin<T extends MachineSchema>(
  name: string,
  component: {
    machine: Machine<T>
    connect: (service: Service<T>, normalizeProps: NormalizeProps<PropTypes>) => any
    collection?: <T extends CollectionItem>(options: CollectionOptions<T>) => ListCollection<T>
  },
) {
  const underScore = name.replaceAll("-", "_")
  const api = `_${underScore}_api`

  return function (Alpine: Alpine) {
    Alpine.directive(name, (el, { expression, value }, { evaluateLater, evaluate }) => {
      if (!value) {
        const service = new AlpineMachine(component.machine, evaluateLater(expression))
        Alpine.bind(el, {
          "x-data"() {
            return {
              service, // dev only
              [api]: component.connect(service, normalizeProps),

              init() {
                queueMicrotask(() => {
                  Alpine.effect(() => {
                    this[api] = component.connect(service, normalizeProps)
                    console.log(el._x_cleanups?.length)
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
        Alpine.bind(el, {
          "x-data"() {
            return {
              get collection() {
                return component.collection?.(evaluate(expression) as any)
              },
            }
          },
        })
      } else {
        const getProps = `get${value
          .split("-")
          .map((v) => v.at(0)?.toUpperCase() + v.substring(1).toLowerCase())
          .join("")}Props`
        function evaluateProps() {
          return (Alpine.$data(el) as any)[api][getProps](expression && evaluate(expression))
        }
      }
    }).before("bind")

    Alpine.magic(
      name
        .split("-")
        .map((str, i) => (i === 0 ? str : str.at(0)?.toUpperCase() + str.substring(1).toLowerCase()))
        .join(""),
      (el) => (Alpine.$data(el) as any)[api],
    )

    // Dev only
    Alpine.magic("highlightState", (el) => {
      const { service } = Alpine.$data(el) as any
      const obj = {
        state: service.state.get(),
        event: service.event.current(),
        previouseEvent: service.event.previous(),
        context: undefined, // wip
      }
      return highlightState(obj)
    })
  }
}
