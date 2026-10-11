<template>
  <div style="width: 60vw">
    <ScatterPlot ref="scatter_plot_ref" mode="debug" />
  </div>

  <GroupedBarChart ref="bar_chart_ref" />
  <HeatMap ref="heat_map_ref" :data="heat_map_data" mode="debug" />

  <div style="width: 50vh; height: 50vw">
    <PDFBarChart ref="pdf_bar_chart_ref" />
  </div>
</template>

<script setup lang="ts">
import { MetricsData } from '@/types/visualization/graph'

import { nextTick, onMounted, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

import ScatterPlot from '@/components/vis-graph/figure/ScatterPlot/index.vue'
import GroupedBarChart from '@/components/vis-graph/figure/GroupedBarChart.vue'
import HeatMap from '@/components/vis-graph/figure/HeatMap/index.vue'

import {
  getTotalChemEntity,
  getExtractedChemEntity,
} from '@/components/vis-graph/data/L1-fetch'
import { getBarData } from '@/components/vis-graph/data/L5-application/bar.ts'

import { initData } from '@/components/vis-graph/data/initData.ts'
import { getMetrics } from '@/components/vis-graph/data/L5-application'
import PDFBarChart from '@/components/vis-graph/figure/base/PDFBarChart.vue'

const scatter_plot_ref = ref<InstanceType<typeof ScatterPlot> | null>(null)
const bar_chart_ref = ref<InstanceType<typeof GroupedBarChart> | null>(null)
const heat_map_ref = ref<InstanceType<typeof HeatMap> | null>(null)
const pdf_bar_chart_ref = ref<InstanceType<typeof PDFBarChart> | null>(null)

const heat_map_data = ref<MetricsData['params'] | null>(null)

const initBarChart = (metrics_data) => {
  bar_chart_ref.value?.initGraph(metrics_data)
}

const initHeatMap = (metrics_data) => {
  heat_map_ref.value?.initGraph(metrics_data)
}

const initAllGraphs = async () => {
  await initData()
  const metrics_data = getMetrics()
  console.log(metrics_data)

  heat_map_data.value = metrics_data.params

  scatter_plot_ref.value?.initGraph()
  bar_chart_ref.value?.initGraph(metrics_data.total.pdf)
  pdf_bar_chart_ref.value?.initGraph()
}

onMounted(() => {
  nextTick(() => {
    initAllGraphs()
  })
})
</script>

<style scoped>
.vis-graph {
  display: inline-block;
}
</style>
