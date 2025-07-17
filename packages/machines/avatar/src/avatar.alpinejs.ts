import type { NormalizeProps, PropTypes } from "@zag-js/types"
import type { Service } from "@zag-js/core"
import { parts } from "./avatar.anatomy"
import * as dom from "./avatar.dom"
import type { AvatarApi, AvatarSchema } from "./avatar.types"

export function alpinejs<T extends PropTypes>(service: Service<AvatarSchema>): AvatarApi<T> {
  const { state, send, prop, scope } = service
  const getLoaded = () => state.matches("loaded")
  return {
    loaded: getLoaded(),
    setSrc(src) {
      const img = dom.getImageEl(scope)
      img?.setAttribute("src", src)
    },
    setLoaded() {
      send({ type: "img.loaded", src: "api" })
    },
    setError() {
      send({ type: "img.error", src: "api" })
    },

    getRootProps() {
      return {
        ...parts.root.attrs,
        ":dir": () => prop("dir"),
        ":id": () => dom.getRootId(scope),
      }
    },

    getImageProps() {
      return {
        ...parts.image.attrs,
        ":hidden": () => !getLoaded(),
        ":dir": () => prop("dir"),
        ":id": () => dom.getImageId(scope),
        ":data-state": () => (getLoaded() ? "visible" : "hidden"),
        "@load"() {
          send({ type: "img.loaded", src: "element" })
        },
        "@error"() {
          send({ type: "img.error", src: "element" })
        },
      }
    },

    getFallbackProps() {
      return {
        ...parts.fallback.attrs,
        ":dir": () => prop("dir"),
        ":id": () => dom.getFallbackId(scope),
        ":hidden": () => getLoaded(),
        ":data-state": () => (getLoaded() ? "hidden" : "visible"),
      }
    },
  }
}
