import { avatarData } from "@zag-js/shared"
import { Toolbar } from "../components/toolbar"
import { StateVisualizer } from "../components/state-visualizer"

export function Avatar() {
  return (
    <main
      class="avatar"
      x-data={`{images: ${JSON.stringify(avatarData.full)},
        getRandomImage() { return this.images[Math.floor(Math.random() * this.images.length)]},
        src: '${avatarData.full[0]}',
        showImage: true}`}
    >
      <div x-id="['avatar']" x-avatar="{id: $id('avatar')}" x-avatar:root>
        <span x-avatar:fallback>PA</span>
        <img x-show="showImage" alt="" referrerpolicy="no-referrer" x-bind:src="src" x-avatar:image />

        <Toolbar>
          <div class="controls">
            <button x-on:click="src = getRandomImage()">Change Image</button>
            <button x-on:click={`src = '${avatarData.broken}'`}>Broken Image</button>
            <button x-on:click="showImage = !showImage">Toggle Image</button>
          </div>
          <StateVisualizer />
        </Toolbar>
      </div>
    </main>
  )
}
