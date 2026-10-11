<script setup lang="ts">
import { reactive } from 'vue'
import { TooltipData } from '@/types/visualization/graph'

const data = reactive<TooltipData>({
  title: '',
  data: {},
})

const setTooltipData = (new_data: TooltipData) => {
  data.title = new_data.title || ''
  data.data = new_data.data
}

const formatValue = (value: unknown) => {
  if (value instanceof Set) {
    return Array.from(value.values())
  } else if (value instanceof Array) {
    const lines = []
    for (const item of value) {
      if (typeof item === 'object') {
        lines.push(`${item.precursor_name}: ${item.amount}`)
      } else {
        lines.push(item)
      }
    }
    return lines
  }

  return [value]
}

defineExpose({
  setTooltipData,
})
</script>

<template>
  <div class="tooltip">
    <span v-show="data.title !== ''" class="title">{{ data.title }}</span>
    <table>
      <tr v-for="(value, key, idx) in data.data" :key="idx">
        <td class="key">{{ key }}</td>
        <td class="value">
          <div v-for="(item, item_id) in formatValue(value)" :key="item_id">
            {{ item }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.tooltip {
  font-family: 'Helvetica', serif;
  font-size: 1rem;
  padding: 8px;
  text-align: center;

  visibility: hidden;
  display: inline-block;
  position: fixed;

  color: #000;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  z-index: 100;
}

.title {
  font-weight: bold;
}

table {
  border-collapse: collapse;
}

tr > td,
tr > td > div {
  padding: 2px;
}

tr:not(:last-child) > td,
tr > td > div:not(:last-child) {
  border-bottom: 1px dashed grey;
}

tr > td.key {
  color: #808080;
  text-align: right;
  padding-right: 0.5rem;
}

tr > td.value {
  text-align: left;
}
</style>
