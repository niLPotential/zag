import { checkboxControls, getControlDefaults } from "@zag-js/shared"
import { Toolbar } from "../components/toolbar"
import { Controls } from "../components/controls"
import { StateVisualizer } from "../components/state-visualizer"

export function Checkbox() {
  const state = getControlDefaults(checkboxControls)

  return (
    <main class="checkbox">
      <form x-data={`${JSON.stringify(state)}`}>
        <fieldset x-id="['checkbox']" x-checkbox={`{${Object.keys(state)}, id: $id('checkbox')}`}>
          <label x-checkbox:root>
            <div x-checkbox:control></div>
            <span x-checkbox:label x-text="'Input ' + ($checkbox.checked ? 'Checked' : 'Unchecked')"></span>
            <input x-checkbox:hidden-input data-testid="hidden-input" />
            <div x-checkbox:indicator></div>
          </label>

          <button type="button" x-bind:disabled="$checkbox.checked" x-on:click="$checkbox.setChecked(true)">
            Check
          </button>
          <button type="button" x-bind:disabled="!$checkbox.checked" x-on:click="$checkbox.setChecked(false)">
            Unheck
          </button>
          <button type="reset">Reset Form</button>

          <Toolbar>
            <Controls state={state} controls={checkboxControls} />
            <StateVisualizer />
          </Toolbar>
        </fieldset>
      </form>
    </main>
  )
}
