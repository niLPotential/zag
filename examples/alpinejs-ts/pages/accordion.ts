import Alpine from "alpinejs"
import * as accordion from "@zag-js/accordion"
import { useMachine } from "@zag-js/alpinejs"

// @ts-ignore
window.Alpine = Alpine

Alpine.data("accordion", () => {
  const service = useMachine(accordion.machine, {
    id: "1",
    dir: "ltr",
  })
  return {
    get api() {
      return accordion.alpine(service)
    },
    init() {
      service.init()
    },
  }
})

Alpine.start()
