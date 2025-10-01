import type { Alpine } from "alpinejs"
import * as accordion from "@zag-js/accordion"
import { AlpineMachine, normalizeProps } from "@zag-js/alpine"

export default function (Alpine: Alpine) {
  Alpine.directive("accordion", (el, { expression, value }, { evaluateLater }) => {
    if (!value) {
      const service = new AlpineMachine(accordion.machine, evaluateLater(expression))
      Alpine.bind(el, {
        "x-data"() {
          return {
            api: accordion.connect(service, normalizeProps),
            init() {
              service.init()
            },
          }
        },
      })
    } else if (value === "root") {
      Alpine.bind(el, {})
    }
  })
}
