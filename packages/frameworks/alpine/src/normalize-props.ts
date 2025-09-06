import { createNormalizer } from "@zag-js/types"

type Dict = Record<string, any>

const propMap: Record<string, string> = {}

const preserveKeys =
  "viewBox,className,preserveAspectRatio,fillRule,clipPath,clipRule,strokeWidth,strokeLinecap,strokeLinejoin,strokeDasharray,strokeDashoffset,strokeMiterlimit".split(
    ",",
  )

function toAlpineProp(key: string) {
  if (key in propMap) return propMap[key]
  if (key.startsWith("on")) return `@${key.substring(2).toLowerCase()}`
  if (preserveKeys.includes(key)) return key
  return `:${key.toLowerCase()}`
}

function toAlpinePropValue(key: string, value: Dict[string]) {
  if (key.startsWith("on")) return value
  return () => value
}

export const normalizeProps = createNormalizer((props) => {
  const normalized: Dict = {}
  for (const key in props) {
    normalized[toAlpineProp(key)] = toAlpinePropValue(key, props[key])
  }
  return normalized
})
