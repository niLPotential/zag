import type { JSX } from "ovr"

export function Layout({ children }: { children: JSX.Element }) {
  return <div class="page">{children}</div>
}
