import { App } from "ovr"

// import Layout from "../components/layout"

import { Accordion } from "../pages/accordion"
import { src as accordionSrc } from "client:script/accordion"

import { AngleSlider } from "../pages/angle-slider"
import { src as angleSliderSrc } from "client:script/angle-slider"

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
app.get("/angle-slider", (c) => {
  c.head(<script type="module" src={angleSliderSrc.module.at(0)}></script>)
  c.page(<AngleSlider />)
})

export default { fetch: app.fetch }
