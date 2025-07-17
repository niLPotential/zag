import { dataAttr, getEventPoint, getEventStep, isLeftClick } from "@zag-js/dom-query"
import type { PropTypes } from "@zag-js/types"
import { parts } from "./angle-slider.anatomy"
import * as dom from "./angle-slider.dom"
import type { AngleSliderService, AngleSliderApi } from "./angle-slider.types"

export function alpinejs<T extends PropTypes>(service: AngleSliderService): AngleSliderApi<T> {
  const { state, send, context, prop, computed, scope } = service

  const getDragging = () => state.matches("dragging")

  const getValue = () => context.get("value")
  const getValueAsDegree = () => computed("valueAsDegree")

  const disabled = prop("disabled")
  const invalid = prop("invalid")
  const readOnly = prop("readOnly")
  const interactive = computed("interactive")

  return {
    value: getValue(),
    valueAsDegree: getValueAsDegree(),
    dragging: getDragging(),
    setValue(value) {
      send({ type: "VALUE.SET", value })
    },

    getRootProps() {
      return {
        ...parts.root.attrs,
        ":id": () => dom.getRootId(scope),
        ":data-disabled": () => dataAttr(disabled),
        ":data-invalid": () => dataAttr(invalid),
        ":data-readonly": () => dataAttr(readOnly),
        ":style": () => ({
          "--value": getValue(),
          "--angle": getValueAsDegree(),
        }),
      }
    },

    getLabelProps() {
      return {
        ...parts.label.attrs,
        ":for": () => dom.getHiddenInputId(scope),
        ":data-disabled": () => dataAttr(disabled),
        ":data-invalid": () => dataAttr(invalid),
        ":data-readonly": () => dataAttr(readOnly),
        "@click"(event: any) {
          if (!interactive) return
          event.preventDefault()
          dom.getThumbEl(scope)?.focus()
        },
      }
    },

    getHiddenInputProps() {
      return {
        type: "hidden",
        ":value": getValue,
        ":name": () => prop("name"),
        ":id": () => dom.getHiddenInputId(scope),
      }
    },

    getControlProps() {
      return {
        ...parts.control.attrs,
        role: "presentation",
        ":id": () => dom.getControlId(scope),
        ":data-disabled": () => dataAttr(disabled),
        ":data-invalid": () => dataAttr(invalid),
        ":data-readonly": () => dataAttr(readOnly),
        "@pointerdown"(event: any) {
          if (!interactive) return
          if (!isLeftClick(event)) return
          const point = getEventPoint(event)
          send({ type: "CONTROL.POINTER_DOWN", point })
          event.stopPropagation()
        },
        ":style": () => ({
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }),
      }
    },

    getThumbProps() {
      return {
        ...parts.thumb.attrs,
        ":id": () => dom.getThumbId(scope),
        role: "slider",
        "aria-valuemax": 360,
        "aria-valuemin": 0,
        ":aria-valuenow": getValue,
        ":tabIndex": () => (readOnly || interactive ? 0 : undefined),
        ":data-disabled": () => dataAttr(disabled),
        ":data-invalid": () => dataAttr(invalid),
        ":data-readonly": () => dataAttr(readOnly),
        "@focus"() {
          send({ type: "THUMB.FOCUS" })
        },
        "@blur"() {
          send({ type: "THUMB.BLUR" })
        },
        "@keydown"(event: any) {
          if (!interactive) return

          const step = getEventStep(event) * prop("step")

          switch (event.key) {
            case "ArrowLeft":
            case "ArrowUp":
              event.preventDefault()
              send({ type: "THUMB.ARROW_DEC", step })
              break
            case "ArrowRight":
            case "ArrowDown":
              event.preventDefault()
              send({ type: "THUMB.ARROW_INC", step })
              break
            case "Home":
              event.preventDefault()
              send({ type: "THUMB.HOME" })
              break
            case "End":
              event.preventDefault()
              send({ type: "THUMB.END" })
              break
            default:
              break
          }
        },
        ":style": () => ({
          rotate: `var(--angle)`,
        }),
      }
    },

    getValueTextProps() {
      return {
        ...parts.valueText.attrs,
        ":id": () => dom.getValueTextId(scope),
      }
    },

    getMarkerGroupProps() {
      return {
        ...parts.markerGroup.attrs,
      }
    },

    getMarkerProps(props) {
      function getMarkerState() {
        if (props.value < getValue()) {
          return "under-value"
        } else if (props.value > getValue()) {
          return "over-value"
        } else {
          return "at-value"
        }
      }

      return {
        ...parts.marker.attrs,
        ":data-value": () => props.value,
        ":data-state": getMarkerState,
        ":data-disabled": () => dataAttr(disabled),
        ":style": () => ({
          "--marker-value": props.value,
          rotate: `calc(var(--marker-value) * 1deg)`,
        }),
      }
    },
  }
}
