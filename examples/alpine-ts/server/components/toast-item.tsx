import { X } from "lucide-static"

export function ToastItem(props: any) {
  return (
    <div {...props} x-toast="{...actor, index, parent}" x-toast:root>
      <span x-toast:ghost-before />
      <div data-scope="toast" data-part="progressbar" />
      <div
        x-toast:title
        x-text="($toast().type === 'loading' ? '<...>' : '')+' '+$toast().title+' '+$toast().type"
      ></div>
      <div x-toast:description x-text="$toast().description"></div>
      <button x-toast:close-trigger>{html(X)}</button>
      <span x-toast:ghost-after />
    </div>
  )
}
