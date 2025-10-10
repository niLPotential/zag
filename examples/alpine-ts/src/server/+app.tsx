import { App } from "ovr"

import { Layout } from "../components/layout"
import { Nav } from "../components/nav"

import { Home } from "../pages/index"
import { src as homeSrc } from "client:script"

import { Accordion } from "../pages/accordion"
import { src as accordionSrc } from "client:script/accordion"

import { AngleSlider } from "../pages/angle-slider"
import { src as angleSliderSrc } from "client:script/angle-slider"

import { Avatar } from "../pages/avatar"
import { src as avatarSrc } from "client:script/avatar"

import { Checkbox } from "../pages/checkbox"
import { src as checkboxSrc } from "client:script/checkbox"

import { Combobox } from "../pages/combobox"
import { src as comboboxSrc } from "client:script/combobox"

import { Dialog } from "../pages/dialog"
import { src as dialogSrc } from "client:script/dialog"

import { Popover } from "../pages/popover"
import { src as popoverSrc } from "client:script/popover"

const app = new App()

app.use((c, next) => {
  c.head(<link rel="icon" type="image/svg+xml" href="/vite.svg" />)
  c.layout(Layout)
  return next()
})
app.get("/", (c) => {
  c.head(<script type="module" src={homeSrc.module.at(0)}></script>)
  c.page(
    <>
      <Nav pathname={c.url.pathname} />
      <Home />
    </>,
  )
})
app.get("/accordion", (c) => {
  c.head(<script type="module" src={accordionSrc.module.at(0)}></script>)
  c.page(
    <>
      <Nav pathname={c.url.pathname} />
      <Accordion />
    </>,
  )
})
app.get("/angle-slider", (c) => {
  c.head(<script type="module" src={angleSliderSrc.module.at(0)}></script>)
  c.page(
    <>
      <Nav pathname={c.url.pathname} />
      <AngleSlider />
    </>,
  )
})
app.get("/avatar", (c) => {
  c.head(<script type="module" src={avatarSrc.module.at(0)}></script>)
  c.page(
    <>
      <Nav pathname={c.url.pathname} />
      <Avatar />
    </>,
  )
})
app.get("/checkbox", (c) => {
  c.head(<script type="module" src={checkboxSrc.module.at(0)}></script>)
  c.page(
    <>
      <Nav pathname={c.url.pathname} />
      <Checkbox />
    </>,
  )
})
app.get("/combobox", (c) => {
  c.head(<script type="module" src={comboboxSrc.module.at(0)}></script>)
  c.page(
    <>
      <Nav pathname={c.url.pathname} />
      <Combobox />
    </>,
  )
})
app.get("/dialog", (c) => {
  c.head(<script type="module" src={dialogSrc.module.at(0)}></script>)
  c.page(
    <>
      <Nav pathname={c.url.pathname} />
      <Dialog />
    </>,
  )
})
app.get("/popover", (c) => {
  c.head(<script type="module" src={popoverSrc.module.at(0)}></script>)
  c.page(
    <>
      <Nav pathname={c.url.pathname} />
      <Popover />
    </>,
  )
})

export default { fetch: app.fetch }
