import { accordionData } from "@zag-js/shared"

export default function Accordion() {
  return (
    <div
      x-data="{collapsible: true, multiple: false}"
      x-id="['accordion']"
      x-accordion="{collapsible, multiple, id: $id('accordion')}"
      x-accordion:root
    >
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
    </div>
  )
}
