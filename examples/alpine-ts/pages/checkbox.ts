import "@zag-js/shared/src/style.css"

import Alpine from "alpinejs"
import * as checkbox from "@zag-js/checkbox"
import { createPlugin } from "../src/plugin"

Alpine.plugin(createPlugin(checkbox))
// @ts-ignore
window.Alpine = Alpine
// @ts-ignore
window.Alpine.start()
