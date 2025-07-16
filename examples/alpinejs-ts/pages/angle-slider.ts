import Alpine from "alpinejs"
import * as angleSlider from "@zag-js/angle-slider"
import { useMachine } from "@zag-js/alpinejs"

// @ts-ignore
window.Alpine = Alpine

Alpine.data("angleSlider", () => {
  const service = useMachine(angleSlider.machine, {
    id: "1",
  })
  return {
    get api() {
      return angleSlider.alpinejs(service)
    },
    init() {
      service.init()
    },
  }
})

Alpine.start()
