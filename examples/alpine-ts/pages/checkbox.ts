import "@zag-js/shared/src/style.css"

import Alpine from "alpinejs"
import Checkbox from "../src/checkbox"

Alpine.plugin(Checkbox)
window.Alpine = Alpine
window.Alpine.start()
