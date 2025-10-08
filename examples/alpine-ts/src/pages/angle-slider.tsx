import { angleSliderControls, getControlDefaults } from "@zag-js/shared"
import { Toolbar } from "../components/toolbar"
import { Controls } from "../components/controls"
import { StateVisualizer } from "../components/state-visualizer"

export function AngleSlider() {
  const state = getControlDefaults(angleSliderControls)

  return (
    <main class="angle-slider" x-data={JSON.stringify(state)}>
      <div
        x-id="['angle-slider']"
        x-angle-slider={`{${Object.keys(state)}, id: $id('angle-slider')}`}
        x-angle-slider:root
      >
        <label x-angle-slider:label>
          Angle Slider: <div x-angle-slider:value-text x-text="$angleSlider.valueAsDegree"></div>
        </label>
        <div x-angle-slider:control>
          <div x-angle-slider:thumb></div>
          <div x-angle-slider:marker-group>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((value) => (
              <div key={value} x-angle-slider:marker={`{value: ${value}}`}></div>
            ))}
          </div>
        </div>
        <input x-angle-slider:hidden-input />
        <Toolbar>
          <Controls state={state} controls={angleSliderControls} />
          <StateVisualizer />
        </Toolbar>
      </div>
    </main>
  )
}
