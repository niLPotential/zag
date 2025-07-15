import { dataAttr, getEventKey, isSafari } from "@zag-js/dom-query"
import type { EventKeyMap, NormalizeProps, PropTypes } from "@zag-js/types"
import type { Service } from "@zag-js/core"
import { parts } from "./accordion.anatomy"
import * as dom from "./accordion.dom"
import type { AccordionApi, AccordionSchema, ItemProps } from "./accordion.types"

export function alpinejs<T extends PropTypes>(service: Service<AccordionSchema>): AccordionApi<T> {
  const { send, context, prop, scope, computed } = service

  const getFocusedValue = () => context.get("focusedValue")
  const getValue = () => context.get("value")
  const getMultiple = () => prop("multiple")

  function setValue(value: string[]) {
    let nextValue = value
    if (!getMultiple() && nextValue.length > 1) {
      nextValue = [nextValue[0]]
    }
    send({ type: "VALUE.SET", value: nextValue })
  }

  function getExpanded(props: ItemProps) {
    return getValue().includes(props.value)
  }
  function getFocused(props: ItemProps) {
    return getFocusedValue() === props.value
  }
  function getDisabled(props: ItemProps) {
    return Boolean(props.disabled ?? prop("disabled"))
  }

  return {
    focusedValue: getFocusedValue(),
    value: getValue(),
    setValue,
    getItemState(props: ItemProps) {
      return {
        expanded: getExpanded(props),
        focused: getFocused(props),
        disabled: getDisabled(props),
      }
    },

    getRootProps() {
      return {
        ...parts.root.attrs,
        ":dir": () => prop("dir"),
        ":id": () => dom.getRootId(scope),
        ":data-orientation": () => prop("orientation"),
      }
    },

    getItemProps(props) {
      return {
        ...parts.item.attrs,
        ":dir": () => prop("dir"),
        ":id": () => dom.getItemId(scope, props.value),
        ":data-state": () => (getExpanded(props) ? "open" : "closed"),
        ":data-focus": () => dataAttr(getFocused(props)),
        ":data-disabled": () => dataAttr(getDisabled(props)),
        ":data-orientation": () => prop("orientation"),
      }
    },

    getItemContentProps(props) {
      return {
        ...parts.itemContent.attrs,
        ":dir": () => prop("dir"),
        ":role": () => "region",
        ":id": () => dom.getItemContentId(scope, props.value),
        ":aria-labelledby": () => dom.getItemTriggerId(scope, props.value),
        ":hidden": () => !getExpanded(props),
        ":data-state": () => (getExpanded(props) ? "open" : "closed"),
        ":data-disabled": () => dataAttr(getDisabled(props)),
        ":data-focus": () => dataAttr(getFocused(props)),
        ":data-orientation": () => prop("orientation"),
      }
    },

    getItemIndicatorProps(props) {
      return {
        ...parts.itemIndicator.attrs,
        ":dir": () => prop("dir"),
        ":aria-hidden": () => true,
        ":data-state": () => (getExpanded(props) ? "open" : "closed"),
        ":data-disabled": () => dataAttr(getDisabled(props)),
        ":data-focus": () => dataAttr(getFocused(props)),
        ":data-orientation": () => prop("orientation"),
      }
    },

    getItemTriggerProps(props) {
      const { value } = props

      return {
        ...parts.itemTrigger.attrs,
        type: "button",
        ":dir": () => prop("dir"),
        ":id": () => dom.getItemTriggerId(scope, value),
        ":aria-controls": () => dom.getItemContentId(scope, value),
        ":aria-expanded": () => getExpanded(props),
        ":disabled": () => getDisabled(props),
        ":data-orientation": () => prop("orientation"),
        ":aria-disabled": () => getDisabled(props),
        ":data-state": () => (getExpanded(props) ? "open" : "closed"),
        ":data-ownedby": () => dom.getRootId(scope),
        "@focus"() {
          if (getDisabled(props)) return
          send({ type: "TRIGGER.FOCUS", value })
        },
        "@blur"() {
          if (getDisabled(props)) return
          send({ type: "TRIGGER.BLUR" })
        },
        "@click"(event) {
          if (getDisabled(props)) return
          if (isSafari()) {
            event.currentTarget.focus()
          }
          send({ type: "TRIGGER.CLICK", value })
        },
        "@keydown"(event) {
          if (event.defaultPrevented) return
          if (getDisabled(props)) return

          const keyMap: EventKeyMap = {
            ArrowDown() {
              if (computed("isHorizontal")) return
              send({ type: "GOTO.NEXT", value })
            },
            ArrowUp() {
              if (computed("isHorizontal")) return
              send({ type: "GOTO.PREV", value })
            },
            ArrowRight() {
              if (!computed("isHorizontal")) return
              send({ type: "GOTO.NEXT", value })
            },
            ArrowLeft() {
              if (!computed("isHorizontal")) return
              send({ type: "GOTO.PREV", value })
            },
            Home() {
              send({ type: "GOTO.FIRST", value })
            },
            End() {
              send({ type: "GOTO.LAST", value })
            },
          }

          const key = getEventKey(event, {
            dir: prop("dir"),
            orientation: prop("orientation"),
          })

          const exec = keyMap[key]

          if (exec) {
            exec(event)
            event.preventDefault()
          }
        },
      }
    },
  }
}
