import type { Alpine, ElementWithXAttributes } from "alpinejs"
import * as checkbox from "@zag-js/checkbox"
import { AlpineMachine, normalizeProps } from "./lib"

export default function (Alpine: Alpine) {
  const elementBindings: [ElementWithXAttributes, keyof checkbox.Api, any][] = []

  Alpine.directive("checkbox", (el, { expression, value }, { evaluateLater }) => {
    if (!value) {
      const service = new AlpineMachine(checkbox.machine, evaluateLater(expression))
      Alpine.bind(el, {
        "x-data"() {
          return {
            __api: checkbox.connect(service, normalizeProps),
            init() {
              Alpine.effect(() => {
                this.__api = checkbox.connect(service, normalizeProps)
                for (const [element, getProps, props] of elementBindings) {
                  Alpine.bind(element, (this.__api[getProps] as any)(props))
                }
              })
              service.init()
            },
          }
        },
      })
    } else if (value === "root") {
      elementBindings.push([el, "getRootProps", null])
    } else if (value === "label") {
      elementBindings.push([el, "getLabelProps", null])
    } else if (value === "control") {
      elementBindings.push([el, "getControlProps", null])
    } else if (value === "indicator") {
      elementBindings.push([el, "getIndicatorProps", null])
    } else if (value === "hidden-input") {
      elementBindings.push([el, "getHiddenInputProps", null])
    }
  }).before("bind")

  Alpine.magic("checkbox", (el) => {
    const { __api } = Alpine.$data(el) as { __api: checkbox.Api }

    return {
      get checked() {
        return __api.checked
      },
      get disabled() {
        return __api.disabled
      },
      get indeterminate() {
        return __api.indeterminate
      },
      get focused() {
        return __api.focused
      },
      get checkedState() {
        return __api.checked
      },

      setChecked: __api.setChecked,
      toggleChecked: __api.toggleChecked,
    }
  })
}
