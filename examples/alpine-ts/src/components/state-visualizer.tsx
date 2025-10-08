export function StateVisualizer({ label }: { label?: string }) {
  return (
    <div class="viz">
      <pre dir="ltr">
        <details open>
          <summary>{label || "Visualizer"}</summary>
          <div x-html="$highlightState"></div>
        </details>
      </pre>
    </div>
  )
}
