import type { App } from "domco"
import { html } from "client:page"
import { html as accordionPage } from "client:page/accordion"
import { html as angleSliderPage } from "client:page/angle-slider"
import { html as avatarPage } from "client:page/avatar"
import { html as checkboxPage } from "client:page/checkbox"
import { html as comboboxPage } from "client:page/combobox"
import { html as dialogPage } from "client:page/dialog"
import { html as popoverPage } from "client:page/popover"

export default {
  fetch(req) {
    const { pathname } = new URL(req.url)

    switch (pathname) {
      case "/":
        return new Response(html, {
          headers: {
            "Content-Type": "text/html",
          },
        })
      case "/accordion":
        return new Response(accordionPage, {
          headers: {
            "Content-Type": "text/html",
          },
        })
      case "/angle-slider":
        return new Response(angleSliderPage, {
          headers: {
            "Content-Type": "text/html",
          },
        })
      case "/avatar":
        return new Response(avatarPage, {
          headers: {
            "Content-Type": "text/html",
          },
        })
      case "/checkbox":
        return new Response(checkboxPage, {
          headers: {
            "Content-Type": "text/html",
          },
        })
      case "/combobox":
        return new Response(comboboxPage, {
          headers: {
            "Content-Type": "text/html",
          },
        })
      case "/dialog":
        return new Response(dialogPage, {
          headers: {
            "Content-Type": "text/html",
          },
        })
      case "/popover":
        return new Response(popoverPage, {
          headers: {
            "Content-Type": "text/html",
          },
        })
      default:
        return new Response("Not found", { status: 404 })
    }
  },
} satisfies App
