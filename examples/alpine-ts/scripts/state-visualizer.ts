import { highlightState } from "@zag-js/stringify-state"
import Alpine from "alpinejs"
import { joinCamelCase } from "../lib/utils"

Alpine.magic("highlightState", () => {
  return function ({ label, omit, context }: { label: string; omit?: string[]; context?: string[] }) {
    // @ts-ignore this
    const service = this["$" + joinCamelCase([...label.split("-"), "service"])]
    return highlightState(
      {
        state: service.state.get(),
        event: service.event.current(),
        previouseEvent: service.event.previous(),
        context: context ? Object.fromEntries(context.map((key) => [key, service.context.get(key)])) : undefined,
      },
      omit,
    )
  }
})
