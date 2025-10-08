import { accordionControls, accordionData, getControlDefaults } from "@zag-js/shared"
import { Toolbar } from "../components/toolbar"
import { Controls } from "../components/controls"
import { StateVisualizer } from "../components/state-visualizer"

export function Accordion() {
  const state = getControlDefaults(accordionControls)

  return (
    <main class="accordion" x-data={JSON.stringify(state)}>
      <div x-id="['accordion']" x-accordion={`{${Object.keys(state)}, id: $id('accordion')}`} x-accordion:root>
        {accordionData.map((item) => (
          <div key={item.id} x-accordion:item={`{value: '${item.id}'}`}>
            <h3>
              <button data-testid={`${item.id}:trigger`} x-accordion:item-trigger={`{value: '${item.id}'}`}>
                {item.label}
                <div x-accordion:item-indicator={`{value: '${item.id}'}`}>{"->"}</div>
              </button>
            </h3>
            <div data-testid={`${item.id}:content`} x-accordion:item-content={`{value: '${item.id}'}`}>
              {item.label + " Content"}
            </div>
          </div>
        ))}
        <Toolbar>
          <Controls state={state} controls={accordionControls} />
          <StateVisualizer />
        </Toolbar>
      </div>
    </main>
  )
}
