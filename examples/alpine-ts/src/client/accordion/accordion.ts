import "@zag-js/shared/src/style.css"

import Alpine from "alpinejs"
import * as accordion from "@zag-js/accordion"
import { createZagPlugin } from "../../lib"

Alpine.plugin(createZagPlugin("accordion", accordion))
// @ts-ignore
window.Alpine = Alpine
// @ts-ignore
window.Alpine.start()
