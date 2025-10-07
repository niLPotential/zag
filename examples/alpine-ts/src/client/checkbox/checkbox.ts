import "@zag-js/shared/src/style.css"

import Alpine from "alpinejs"
import * as checkbox from "@zag-js/checkbox"
import { createZagPlugin } from "../../lib"

Alpine.plugin(createZagPlugin("checkbox", checkbox))
// @ts-ignore
window.Alpine = Alpine
// @ts-ignore
window.Alpine.start()
