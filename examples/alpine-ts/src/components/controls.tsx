import type { ControlRecord } from "@zag-js/shared"
import { deepGet, getControlDefaults } from "@zag-js/shared"

export function Controls({ controls }: { controls: ControlRecord }) {
  const state = getControlDefaults(controls)

  return (
    <div class="controls-container">
      {Object.keys(controls).map((key) => {
        const { type, label = key } = controls[key]
        const value = deepGet(state, key)
        switch (type) {
          case "boolean":
            return (
              <div key={key} class="checkbox">
                <input data-testid={key} id={label} type="checkbox" defaultChecked={value} x-model={key} />
                <label for={label}>{label}</label>
              </div>
            )
          case "string":
            const { placeholder } = controls[key]
            return (
              <div key={key} class="text">
                <label style="margin-right: 10px">{label}</label>
                <input data-testid={key} type="text" placeholder={placeholder} defaultValue={value} x-model={key} />
              </div>
            )
          case "select": {
            const { options } = controls[key]
            return (
              <div key={key} classname="text">
                <label for={label} style="margin-right: 10px">
                  {label}
                </label>
                <select data-testid={key} id={label} defaultValue={value} x-model={key}>
                  <option>-----</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          case "number":
            const { min, max } = controls[key]
            return (
              <div key={key} class="text">
                <label for={label} style="margin-right: 10px">
                  {label}
                </label>
                <input
                  data-testid={key}
                  id={label}
                  type="number"
                  min={min}
                  max={max}
                  defaultValue={value}
                  x-model={key}
                />
              </div>
            )
        }
      })}
    </div>
  )
}
