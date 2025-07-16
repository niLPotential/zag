import Alpine from "alpinejs"
import * as avatar from "@zag-js/avatar"
import { useMachine } from "@zag-js/alpinejs"

// @ts-ignore
window.Alpine = Alpine

Alpine.data("avatar", () => {
  const service = useMachine(avatar.machine, {
    id: "1",
  })
  return {
    get api() {
      return avatar.alpinejs(service)
    },
    init() {
      service.init()
    },
  }
})

Alpine.start()
