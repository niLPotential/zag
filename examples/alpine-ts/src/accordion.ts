import type { Alpine } from "alpinejs"
import * as accordion from "@zag-js/accordion"
import { AlpineMachine, normalizeProps } from "./lib"

export default function (Alpine: Alpine) {
  Alpine.directive("accordion", (el, { expression, value }, { evaluate, evaluateLater }) => {
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
      Alpine.bind(el, (Alpine.$data(el).api as accordion.Api).getRootProps)
    } else if (value === "item") {
      Alpine.bind(el, (Alpine.$data(el).api as accordion.Api).getItemProps(evaluate(expression)))
    } else if (value === "item-content") {
      Alpine.bind(el, (Alpine.$data(el).api as accordion.Api).getItemContentProps(evaluate(expression)))
    } else if (value === "item-indicator") {
      Alpine.bind(el, (Alpine.$data(el).api as accordion.Api).getItemIndicatorProps(evaluate(expression)))
    } else if (value === "item-trigger") {
      Alpine.bind(el, (Alpine.$data(el).api as accordion.Api).getItemTriggerProps(evaluate(expression)))
    }
  })
}
