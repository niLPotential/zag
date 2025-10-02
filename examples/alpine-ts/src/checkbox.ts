import type { Alpine } from "alpinejs"
import * as checkbox from "@zag-js/checkbox"
import { AlpineMachine, normalizeProps } from "./lib"

export default function (Alpine: Alpine) {
  Alpine.directive("checkbox", (el, { expression, value }, { evaluateLater }) => {
    if (!value) {
      const service = new AlpineMachine(checkbox.machine, evaluateLater(expression))
      Alpine.bind(el, {
        "x-data"() {
          return {
            api: checkbox.connect(service, normalizeProps),
            init() {
              Alpine.effect(() => {
                this.$data.api = checkbox.connect(service, normalizeProps)
              })
              service.init()
            },
          }
        },
      })
    } else if (value === "root") {
      Alpine.bind(el, (Alpine.$data(el).api as checkbox.Api).getRootProps)
    } else if (value === "label") {
      Alpine.bind(el, (Alpine.$data(el).api as checkbox.Api).getLabelProps)
    } else if (value === "control") {
      Alpine.bind(el, (Alpine.$data(el).api as checkbox.Api).getControlProps)
    } else if (value === "indicator") {
      Alpine.bind(el, (Alpine.$data(el).api as checkbox.Api).getIndicatorProps)
    } else if (value === "hidden-input") {
      Alpine.bind(el, (Alpine.$data(el).api as checkbox.Api).getHiddenInputProps)
    }
  })
}
