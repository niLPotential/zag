import { App } from "ovr"

// import Layout from "../components/layout"

import { Accordion } from "../pages/accordion"
import { src as accordionSrc } from "client:script/accordion"

const app = new App()

// app.use((c, next) => {
//   c.layout(Layout)
//   return next()
// })
app.get("/", () => "hi")
app.get("/accordion", (c) => {
  c.head(<script type="module" src={accordionSrc.module.at(0)}></script>)
  c.page(<Accordion />)
})

export default { fetch: app.fetch }
