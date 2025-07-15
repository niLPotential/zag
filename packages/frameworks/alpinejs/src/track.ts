import Alpine from "alpinejs"

export const useTrack = (deps: any[], effect: VoidFunction) => {
  Alpine.watch(
    () => [...deps.map((d) => d())],
    () => {
      effect()
    },
  )
}
