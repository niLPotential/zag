import { dataAttr } from "@zag-js/dom-query"
import { routesData } from "@zag-js/shared"

export function Nav({ pathname }: { pathname: string }) {
  return (
    <aside class="nav">
      <header>Zagjs</header>
      {routesData
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((route) => (
          <a data-active={dataAttr(pathname === route.path)} href={route.path}>
            {route.label}
          </a>
        ))}
    </aside>
  )
}
