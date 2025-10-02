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
  }).before("bind")

  Alpine.magic("checkbox", (el) => {
    const { api } = Alpine.$data(el) as { api: checkbox.Api }

    return {
      get checked() {
        return api.checked
      },
      get disabled() {
        return api.disabled
      },
      get indeterminate() {
        return api.indeterminate
      },
      get focused() {
        return api.focused
      },
      get checkedState() {
        return api.checked
      },

      setChecked: api.setChecked,
      toggleChecked: api.toggleChecked,

      get rootProps() {
        return api.getRootProps()
      },
      get labelProps() {
        return api.getLabelProps()
      },
      get controlProps() {
        return api.getControlProps()
      },
      get indicatorProps() {
        return api.getIndicatorProps()
      },
      get hiddenInputProps() {
        return api.getHiddenInputProps()
      },
    }
  })
}
