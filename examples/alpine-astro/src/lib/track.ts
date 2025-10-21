import Alpine from "alpinejs"
import { isEqual, isFunction } from "@zag-js/utils"

function access(value: any) {
  if (isFunction(value)) return value()
  return value
}

export const track = (deps: any[], effect: VoidFunction) => {
  // @ts-ignore @types/alpinejs is out of date
  Alpine.watch(
    () => deps.map((d) => access(d)),
    (current: any[], previous: any[]) => {
      let changed = false
      for (let i = 0; i < current.length; i++) {
        if (!isEqual(previous[i], access(current[i]))) {
          changed = true
          break
        }
      }
      if (changed) effect()
    },
  )
}
