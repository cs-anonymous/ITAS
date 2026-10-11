<template>
  <svg ref="chart_ref" />
  <ToolTip ref="tooltip_ref" />
</template>

<script setup lang="ts">
import { PropType } from 'vue'

import * as d3 from 'd3'
import { reactive, ref, watchEffect } from 'vue'

import ToolTip from '@/components/vis-graph/figure/ToolTip.vue'
import { calcTooltipLocation } from '@/components/vis-graph/figure/utils.ts'

const chart_ref = ref<SVGSVGElement | null>(null)
const tooltip_ref = ref<InstanceType<typeof ToolTip> | null>(null)

const props = defineProps({
  pdf: {
    type: Object as PropType<number[]>,
    required: true,
  },
  color: {
    type: String,
    required: false,
  },
})

const chart = reactive({
  status: {
    loading: true,
  },
  size: {
    width: 300,
    height: 300,
    margin: 20,
  },
  color: <string>'#66ccff',
  data: <number[]>Array.from({ length: 10 }, (v, i) => i + 1),
})

const drawGraph = () => {
  const width = chart.size.width
  const height = chart.size.height
  const margin = chart.size.margin

  const range = Array.from({ length: 10 }, (v, i) => i.toString()).reverse()

  const max_y = d3.max(chart.data) ?? 0

  const tooltip = tooltip_ref.value?.$el

  const svg = d3
    .select(chart_ref.value)
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${width} ${height}`)

  svg.selectAll('*').remove()

  const x_scale = d3
    .scaleBand()
    .domain(range)
    .range([margin, width])
    .padding(0.1)

  const y_scale = d3
    .scaleLinear()
    .domain([0, max_y])
    .range([height - margin, margin])

  const x_axis = d3.axisBottom(x_scale)
  const y_axis = d3.axisLeft(y_scale).ticks(max_y)

  const bars = svg.append('g').style('transform', `translate(${margin}, 0)`)

  svg
    .append('g')
    .attr('transform', `translate(0, ${height - margin})`)
    .call(x_axis)
    // .call((g) => g.selectAll('text').attr('transform', `translate(0, ${12})`))
    .call((g) => g.selectAll('text').remove())
    .call((g) => g.selectAll('.tick').remove())

  svg.append('g').attr('transform', `translate(${margin}, 0)`).call(y_axis)

  const formatValue = (value: number) => Math.round(value * 10000) / 10000

  for (let i = 9; i >= 0; i--) {
    const value = chart.data[i]
    const idx = i.toString()
    bars
      .append('rect')
      .datum(value)
      .attr('x', x_scale(idx))
      .attr('y', y_scale(value))
      .attr('width', x_scale.bandwidth())
      .attr('height', y_scale(0) - y_scale(value))
      .attr('fill', chart.color)
      .on('mouseover', (event, d) => {
        tooltip_ref.value?.setTooltipData({
          title: formatValue(d),
          data: {
            range: `${(i * 0.1).toFixed(1)} ~ ${((i + 1) * 0.1).toFixed(1)}`,
          },
        })
        tooltip.style.setProperty('visibility', 'visible')
      })
      .on('mousemove', (event) => {
        const new_location = calcTooltipLocation(tooltip, event)
          tooltip.style.left = `${new_location.left}px`
          tooltip.style.top = `${new_location.top}px`
      })
      .on('mouseout', () => {
        tooltip.style.setProperty('visibility', 'hidden')
      })
  }
}

const initGraph = () => {
  drawGraph()
}

defineExpose({
  initGraph,
})

watchEffect(() => {
  console.log('Init PDF Bar Chart')
  if (props.pdf && props.color) {
    chart.data = props.pdf
    chart.color = props.color
    initGraph()
  }
})
</script>

<style scoped></style>
