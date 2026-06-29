<script setup lang="ts">
import * as select from "@zag-js/select"
import { normalizeProps, useMachine } from "@zag-js/vue"

interface Item {
  label: string
  value: string
}

const items: Item[] = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Solid", value: "solid" },
]

const value = ["react"]

const collection = select.collection({
  items,
  itemToValue: (item) => item.value,
  itemToString: (item) => item.label,
})

const service = useMachine(select.machine as select.Machine<Item>, {
  id: useId(),
  collection,
  value,
})

const api = computed(() => select.connect(service, normalizeProps))
</script>

<template>
  <main className="select" style="padding: 2rem">
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 320px">
      <div style="font-size: 0.875rem"><strong>Value (controlled, fixed):</strong> {{ value.join(", ") }}</div>
      <div data-testid="selected-items" style="font-size: 0.875rem">
        <strong>Selected items (from api):</strong> {{ api.selectedItems.map((item) => item.label).join(", ") }}
      </div>

      <div v-bind="api.getRootProps()">
        <label v-bind="api.getLabelProps()">Select framework</label>
        <div v-bind="api.getControlProps()" style="display: flex; margin-top: 4px">
          <button data-testid="trigger" v-bind="api.getTriggerProps()" style="padding: 8px 12px; flex: 1">
            <span>{{ api.valueAsString || "Select option" }}</span>
            <span style="margin-left: 8px">▼</span>
          </button>
        </div>

        <Teleport to="#teleports">
          <div v-bind="api.getPositionerProps()">
            <ul data-testid="select-content" v-bind="api.getContentProps()" style="list-style: none; padding: 4px">
              <li
                v-for="item in items"
                :key="item.value"
                :data-testid="item.value"
                v-bind="api.getItemProps({ item })"
                style="padding: 8px 12px"
              >
                <span v-bind="api.getItemTextProps({ item })">{{ item.label }}</span>
                <span v-bind="api.getItemIndicatorProps({ item })">✓</span>
              </li>
            </ul>
          </div>
        </Teleport>
      </div>
    </div>
  </main>
</template>
