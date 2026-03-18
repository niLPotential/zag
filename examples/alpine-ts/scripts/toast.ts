import * as dialog from "@zag-js/dialog"
import { toastControls } from "@zag-js/shared"
import * as toast from "@zag-js/toast"
import Alpine from "alpinejs"
import { useControls, usePlugin } from "../lib"

Alpine.data("overlap", () => ({ toaster: toast.createStore({ overlap: true, placement: "bottom", gap: 24 }) }))
Alpine.data("stacked", () => ({ toaster: toast.createStore({ overlap: false, placement: "bottom", gap: 24 }) }))
Alpine.data("toast", useControls(toastControls))
Alpine.plugin(usePlugin("toast-group", toast.group))
Alpine.plugin(usePlugin("toast", toast))
Alpine.plugin(usePlugin("dialog", dialog))
Alpine.start()
