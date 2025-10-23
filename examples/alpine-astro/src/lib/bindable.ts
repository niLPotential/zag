import type { Bindable, BindableParams } from "@zag-js/core"
import { identity, isFunction } from "@zag-js/utils"
import Alpine from "alpinejs"

export function bindable<T>(props: () => BindableParams<T>): Bindable<T> {
  const initial = props().value ?? props().defaultValue
  const eq = props().isEqual ?? Object.is

  const v = Alpine.reactive({ value: initial as T })

  const controlled = () => props().value !== undefined

  function setFn(val: T | ((prev: T) => T)) {
    const prev = controlled() ? (props().value as T) : v.value
    const next = isFunction(val) ? val(prev) : val
    if (props().debug) {
      console.log(`[bindable > ${props().debug}] setValue`, { next, prev })
    }

    if (!controlled()) v.value = next
    if (!eq(next, prev)) {
      props().onChange?.(next, prev)
    }
  }

  return {
    initial,
    ref: { value: controlled() ? props().value : v.value },
    get() {
      return controlled() ? (props().value as T) : v.value
    },
    set(val: T | ((prev: T) => T)) {
      const exec = props().sync ? identity : Alpine.nextTick
      exec(() => setFn(val))
    },
    invoke(nextValue: T, prevValue: T) {
      props().onChange?.(nextValue, prevValue)
    },
    hash(value: T) {
      return props().hash?.(value) ?? String(value)
    },
  }
}

bindable.cleanup = (_fn: VoidFunction) => {
  // No-op in vanilla implementation
}

bindable.ref = <T>(defaultValue: T) => {
  let value = defaultValue
  return {
    get: () => value,
    set: (next: T) => {
      value = next
    },
  }
}
