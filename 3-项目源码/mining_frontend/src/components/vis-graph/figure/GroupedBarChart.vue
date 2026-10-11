<template>
  <div class="vis-graph">
    <div class="bar-chart">
      <!--      <h1>Bar chart</h1>-->
      <!--      <h2 v-show="chart.status.loading">Loading data...</h2>-->
      <svg ref="chart_ref" />
    </div>

    <ToolTip ref="tooltip_ref" />
  </div>
</template>

<script setup lang="ts">
import { PDFResult } from '@/types/visualization/calculation'

import * as d3 from 'd3'
import { reactive, ref, watch } from 'vue'
import ToolTip from '@/components/vis-graph/figure/ToolTip.vue'

import { KEY_NAME_DICT } from '@/components/vis-graph/name_dict.ts'

import { calcPDFResultMaxY } from './utils.ts'

const chart_ref = ref<SVGSVGElement | null>(null)
const tooltip_ref = ref<InstanceType<typeof ToolTip> | null>(null)

const chart = reactive({
  status: {
    loading: true,
  },
  size: {
    width: 900,
    height: 300,
    margin: 30,
  },
  data: <PDFResult>{},
})

const drawGraph = () => {
  const width = chart.size.width
  const height = chart.size.height
  const margin = chart.size.margin

  const metrics = KEY_NAME_DICT.metrics
  const range = Array.from({ length: 10 }, (v, i) => i.toString()).reverse()

  const max_y = calcPDFResultMaxY(chart.data)

  const tooltip = tooltip_ref.value?.$el

  const svg = d3
    .select(chart_ref.value)
    .attr('viewBox', `0 0 ${width} ${height}`)

  svg.selectAll('*').remove()

  const x_scale = d3
    .scaleBand()
    .domain(metrics)
    .range([margin, width - margin])
    .padding(0.1)

  const x_sub_scale = d3
    .scaleBand()
    .domain(range)
    .range([0, x_scale.bandwidth()])
    .padding(0.05)

  const y_scale = d3
    .scaleLinear()
    .domain([0, max_y])
    .range([height - margin, margin])

  const x_axis = d3.axisBottom(x_scale)
  const y_axis = d3.axisLeft(y_scale).ticks(max_y)

  const bar_chart = svg
    .append('g')
    .style('transform', `translate(${margin}, 0)`)

  svg
    .append('g')
    .attr('transform', `translate(0, ${height - margin})`)
    .call(x_axis)
    // .call((g) => g.selectAll('text').attr('transform', `translate(0, ${12})`))
    .call((g) => g.selectAll('text').remove())
    .call((g) => g.selectAll('.tick').remove())

  svg.append('g').attr('transform', `translate(${margin}, 0)`).call(y_axis)

  metrics.forEach((metric) => {
    svg
      .append('g')
      .attr('transform', `translate(${x_scale(metric)}, ${height - margin})`)
      .call(d3.axisBottom(x_sub_scale))
      .call((g) => g.select('.domain').remove())
  })

  const colorScale = d3
    .scaleOrdinal()
    .domain(metrics)
    // Color palette inspired by Sayu
    .range(['#8c5d42', '#da9464', '#809a54'])

  const getTransition = () =>
    d3.transition().duration(150).ease(d3.easeCubicInOut)

  const handleHighlight = (category) => {
    metrics.forEach((c) => {
      if (c === category) {
        bar_chart
          .selectAll(`.bar-${c}`)
          .transition(getTransition())
          .style('opacity', 1)
      } else {
        bar_chart
          .selectAll(`.bar-${c}`)
          .transition(getTransition())
          .style('opacity', 0.2)
      }
    })
  }

  const handleUnHighlight = () => {
    metrics.forEach((c) => {
      bar_chart
        .selectAll(`.bar-${c}`)
        .transition(getTransition())
        .style('opacity', 1)
    })
  }

  const bars = bar_chart.append('g')

  const indicator_line = svg
    .append('line')
    .attr('x1', margin + 10)
    .attr('y1', height - margin)
    .attr('x2', width - margin - 10)
    .attr('y2', height - margin)
    .attr('stroke', 'rgba(0, 0, 0, 0.5)')
    .attr('stroke-width', 4)
    .attr('stroke-linecap', 'round')
    .style('opacity', 0)

  const bar_chart_text = bar_chart.append('g')

  const formatValue = (value) => Math.round(value * 10000) / 10000

  for (const metric of metrics) {
    for (let i = 9; i >= 0; i--) {
      const idx = i.toString()
      bars
        .append('rect')
        .datum(chart.data[metric][idx])
        .attr('class', `bar-${idx}`)
        .attr('x', x_scale(metric) + x_sub_scale(idx))
        .attr('y', (d) => y_scale(d))
        .attr('width', x_sub_scale.bandwidth())
        .attr('height', (d) => height - margin - y_scale(d))
        .attr('fill', colorScale(metric))
        .on('mouseover', (event, d) => {
          handleHighlight(idx)
          indicator_line
            .transition(getTransition())
            .style(
              'transform',
              `translateY(${-(height - margin - y_scale(d))}px)`,
            )
            .style('opacity', 1)
          tooltip.style.setProperty('visibility', 'visible')
          tooltip_ref.value?.setTooltipData({
            title: formatValue(d),
            data: {
              metric: metric,
              range: `${(i * 0.1).toFixed(1)} ~ ${((i + 1) * 0.1).toFixed(1)}`,
            },
          })
        })
        .on('mousemove', (event) => {
          tooltip.style.setProperty('left', `${event.clientX + 10}px`)
          tooltip.style.setProperty(
            'top',
            `${event.clientY - tooltip.clientHeight - 4}px`,
          )
        })
        .on('mouseout', () => {
          handleUnHighlight()
          indicator_line.transition(getTransition()).style('opacity', 0)
          tooltip.style.setProperty('visibility', 'hidden')
        })

      bar_chart_text
        .append('text')
        .datum(chart.data[metric][idx])
        .text((d) => formatValue(d))
        .attr('class', `bar-${idx}`)
        .attr(
          'x',
          (d) =>
            x_scale(metric) + x_sub_scale(idx) + x_sub_scale.bandwidth() / 2,
        )
        .attr('y', (d) => y_scale(d) - 10)
        .attr('fill', () => colorScale(idx))
        .attr('text-anchor', 'middle')
    }
  }
}

const initGraph = (metrics_data: PDFResult) => {
  console.log('Init grouped bar chart')
  chart.data = metrics_data
  chart.status.loading = true
  drawGraph()
  chart.status.loading = false
}

defineExpose({
  initGraph,
})
</script>

<style scoped>
.bar-chart {
  transition: opacity 1s cubic-bezier(0.38, 0, 0.24, 1);
}
</style>
