<script setup lang="ts">
import { tagsInputControls } from "@zag-js/shared"
import * as tagsInput from "@zag-js/tags-input"
import { normalizeProps, useMachine } from "@zag-js/vue"

function toDashCase(str: string) {
  return str.replace(/\s+/g, "-").toLowerCase()
}

const controls = useControls(tagsInputControls)

const submitCount = ref(0)
const lastSubmit = ref<string | null>(null)

const service = useMachine(
  tagsInput.machine,
  controls.mergeProps({
    id: useId(),
    name: "tags",
    defaultValue: ["React", "Vue"],
  }),
)

const api = computed(() => tagsInput.connect(service, normalizeProps))

function handleSubmit(e: SubmitEvent) {
  const data = new FormData(e.currentTarget as HTMLFormElement)
  const value = String(data.get("tags") ?? "")
  submitCount.value++
  lastSubmit.value = value
}
</script>

<template>
  <main class="tags-input">
    <form @submit.prevent="handleSubmit">
      <div v-bind="api.getRootProps()">
        <label v-bind="api.getLabelProps()">Enter frameworks:</label>
        <div v-bind="api.getControlProps()">
          <span
            v-for="(value, index) in api.value"
            :key="`${toDashCase(value)}-tag-${index}`"
            v-bind="api.getItemProps({ index, value })"
          >
            <div :data-testid="`${toDashCase(value)}-tag`" v-bind="api.getItemPreviewProps({ index, value })">
              <span :data-testid="`${toDashCase(value)}-valuetext`" v-bind="api.getItemTextProps({ index, value })">
                {{ value }}
              </span>
              <button
                :data-testid="`${toDashCase(value)}-close-button`"
                v-bind="api.getItemDeleteTriggerProps({ index, value })"
              >
                &#x2715;
              </button>
            </div>
            <input :data-testid="`${toDashCase(value)}-input`" v-bind="api.getItemInputProps({ index, value })" />
          </span>
          <input data-testid="input" placeholder="add tag" v-bind="api.getInputProps()" />
          <button type="button" v-bind="api.getClearTriggerProps()">X</button>
        </div>
        <input v-bind="api.getHiddenInputProps()" />
      </div>

      <div style="margin-top: 16">
        <button type="submit">Submit</button>
      </div>
    </form>

    <section style="margin-top: 16">
      <strong>submit count:</strong> <span data-testid="submit-count">{{ submitCount }}</span>
      <br />
      <strong>last submitted value:</strong> <span data-testid="last-submit">{{ lastSubmit ?? "—" }}</span>
    </section>
  </main>

  <Toolbar>
    <StateVisualizer :state="service" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
