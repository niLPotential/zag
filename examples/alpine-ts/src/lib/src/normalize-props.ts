import { createNormalizer } from "@zag-js/types"

export const normalizeProps = createNormalizer((props) => {
  return Object.fromEntries(
    Object.keys(props).map((key) => {
      if (key.startsWith("on")) {
        return ["@" + key.substring(2).toLowerCase(), props[key]]
      }
      return [":" + key.toLowerCase(), () => props[key]]
    }),
  )
})
