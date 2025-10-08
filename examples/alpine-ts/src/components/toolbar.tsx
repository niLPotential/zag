import type { JSX } from "ovr"

export function Toolbar({ children }: { children: JSX.Element }) {
  return (
    <div class="toolbar">
      <div>{children}</div>
    </div>
  )
}
