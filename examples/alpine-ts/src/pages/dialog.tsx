export function Dialog() {
  return (
    <main x-id="['dialog']" x-dialog="{id: $id('dialog')}">
      <button x-dialog:trigger> Click me</button>
      <template x-teleport="body">
        <div x-show="$dialog.open">
          <div x-dialog:backdrop></div>
          <div x-dialog:positioner>
            <div x-dialog:content>
              <h2 x-dialog:title>Edit profile</h2>
              <p x-dialog:dscription>Make changes to your profile here. Click save when you are done.</p>
              <div>
                <input placeholder="Enter name..." />
                <button>Save</button>
              </div>
              <button x-dialog:close-trigger>Close</button>
            </div>
          </div>
        </div>
      </template>
    </main>
  )
}
