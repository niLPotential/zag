import { createNormalizer } from "@zag-js/types"

const propMap: Record<string, string> = {
  htmlFor: "for",
  className: "class",
  onDoubleClick: "onDblclick",
  onChange: "onInput",
  onFocus: "onFocusin",
  onBlur: "onFocusout",
  defaultValue: "value",
  defaultChecked: "checked",
}

export const normalizeProps = createNormalizer((props) => {
  return Object.entries(props).reduce<Record<string, any>>((acc, [key, value]) => {
    if (key === "children") {
      acc["x-html"] = () => value
      return acc
    }
    if (key in propMap) {
      key = propMap[key]
    }
    if (key.startsWith("on")) {
      acc["@" + key.substring(2).toLowerCase()] = value
      return acc
    }
    acc[":" + key.toLowerCase()] = () => value
    return acc
  }, {})
})
