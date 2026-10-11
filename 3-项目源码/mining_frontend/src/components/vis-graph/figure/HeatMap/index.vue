<template>
  <div class="vis-graph" v-show="mode === 'debug'">
    <div class="heat-map">
      <h1>Heat map</h1>
      <h2 v-show="chart.status.loading">Loading data...</h2>
      <h3>Type: {{ chart.shape }}</h3>
    </div>
  </div>

  <div v-if="Object.keys(chart.data).length === 0" style="text-align: center">
    No Shared MOFs
  </div>

  <v-row v-else>
    <v-col :cols="9"><svg ref="chart_ref" /></v-col>
    <v-col :cols="3"><ControlPanel v-model:shape="chart.shape" /></v-col>
  </v-row>

  <ToolTip ref="tooltip_ref" />
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { MetricsData } from '@/types/visualization/graph'

import * as d3 from 'd3'
import { reactive, ref, watchEffect } from 'vue'
import ToolTip from '@/components/vis-graph/figure/ToolTip.vue'

import { KEY_NAME_DICT } from '@/components/vis-graph/name_dict.ts'
import {
  COLOR_PANEL,
  calcTooltipLocation,
} from '@/components/vis-graph/figure/utils.ts'

import ControlPanel from './HeatMap-control-panel.vue'

const props = defineProps({
  mode: {
    type: String as PropType<'release' | 'debug'>,
    required: false,
    default: 'release',
  },
  data: {
    type: Object as PropType<MetricsData['params']>,
    required: true,
  },
})

const chart_ref = ref<SVGSVGElement | null>(null)
const tooltip_ref = ref<InstanceType<typeof ToolTip> | null>(null)

const chart = reactive({
  status: {
    loading: true,
  },
  size: {
    width: 1200,
    height: 500,
    margin: {
      top: 30,
      right: 10,
      bottom: 150,
      left: 80,
    },
  },
  data: <MetricsData['params']>{},
  shape: <'rect' | 'circle' | 'text' | 'numerical'>'rect',
})

const drawGraph = () => {
  const width = chart.size.width
  const height = chart.size.height
  const margin = chart.size.margin.top
  const margin_left = chart.size.margin.left
  const margin_bottom = chart.size.margin.bottom

  const metrics = [...KEY_NAME_DICT.metrics].reverse()
  const params = Object.keys(chart.data)

  const tooltip = tooltip_ref.value?.$el

  const svg = d3
    .select(chart_ref.value)
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${width} ${height}`)

  svg.selectAll('*').remove()

  const x_scale = d3
    .scaleBand()
    .domain(params)
    .range([margin_left, width - margin])
    .padding(0.05)

  const y_scale = d3
    .scaleBand()
    .domain(metrics)
    .range([height - margin_bottom, margin])
    .padding(0.05)

  const numerical_color_scale = d3
    .scaleSequential(d3.interpolateRgbBasis(['#07e000', '#ffc100', '#ff3030']))
    .domain([0.5, 1])

  const color_bands = COLOR_PANEL.map((color: string) =>
    d3
      .scaleSequential(d3.interpolateRgbBasis(['#fdfbe3', color]))
      .domain([0, 1]),
  )

  const x_axis = d3.axisBottom(x_scale).tickSize(0)
  const y_axis = d3.axisLeft(y_scale).tickSize(0)

  const x_axis_group = svg
    .append('g')
    .attr('transform', `translate(0, ${height - margin_bottom})`)
    .style('font-size', '1rem')
    .call(x_axis)
    .call((g) => g.select('.domain').remove())

    // 将 x 轴的文字旋转 45 度
    .selectAll('.tick text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-45)')

  // svg
  //   .append('g')
  //   .attr('transform', `translate(${margin_left}, 0)`)
  //   .style('font-size', '1rem')
  //   .call(y_axis)
  //   .call((g) => g.select('.domain').remove())

  const squares = svg.append('g')

  const formatValue = (value: number) => Math.round(value * 10000) / 10000

  const getTransition = () =>
    d3.transition().duration(200).ease(d3.easeCubicInOut)

  // 使用矩形高度描述指标
  const addRect = (
    obj: d3.Selection,
    param: string,
    metric: string,
    idx: number,
  ) => {
    return obj
      .datum(chart.data[param].metrics[metric])
      .attr('x', x_scale(param))
      .attr('y', (d: number) =>
        isNaN(d) ? 0 : y_scale(metric) + y_scale.bandwidth() * (1 - d),
      )
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', x_scale.bandwidth())
      .attr('height', (d: number) => (isNaN(d) ? 0 : y_scale.bandwidth() * d))
      .style('fill', COLOR_PANEL[3 - idx])
  }

  // 使用圆的面积描述指标
  const addCircle = (
    obj: d3.Selection,
    param: string,
    metric: string,
    idx: number,
  ) => {
    obj
      .datum(chart.data[param].metrics[metric])
      .attr('cx', x_scale(param) + x_scale.bandwidth() / 2)
      .attr('cy', y_scale(metric) + y_scale.bandwidth() / 2)
      .attr('r', (d) =>
        isNaN(d)
          ? 0
          : (Math.sqrt(d) *
              Math.min(x_scale.bandwidth(), y_scale.bandwidth())) /
            2,
      )
      .style('fill', COLOR_PANEL[3 - idx])
  }

  // 使用文字描述指标
  const addText = (
    obj: d3.Selection,
    param: string,
    metric: string,
    idx: number,
  ) => {
    obj
      .datum(chart.data[param].metrics[metric])
      .attr('x', x_scale(param) + x_scale.bandwidth() / 2)
      .attr('y', y_scale(metric) + y_scale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d: number) => formatValue(d))
      .attr(
        'font-size',
        `${Math.min(x_scale.bandwidth(), y_scale.bandwidth()) / 3}px`,
      )
      .style('fill', (d) => (isNaN(d) ? 'grey' : COLOR_PANEL[3 - idx]))
  }

  // 使用颜色描述指标（标准数值样式）
  const addNumerical = (obj: d3.Selection, param: string, metric: string) => {
    obj
      .datum(chart.data[param].metrics[metric] as number)
      .attr('x', x_scale(param))
      .attr('y', y_scale(metric))
      .attr('width', x_scale.bandwidth())
      .attr('height', y_scale.bandwidth())
      .style('fill', (d: number) =>
        isNaN(d) ? 'grey' : numerical_color_scale(d),
      )
  }

  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i]
    for (const param of params) {
      const el: d3.Selection = (() => {
        switch (chart.shape) {
          case 'circle':
            return squares.append('circle')
          case 'text':
            return squares.append('text')
          default:
            return squares.append('rect')
        }
      })()

      switch (chart.shape) {
        case 'rect':
          el.call(addRect, param, metric, i)
          break
        case 'circle':
          el.call(addCircle, param, metric, i)
          break
        case 'text':
          el.call(addText, param, metric, i)
          break
        case 'numerical':
          el.call(addNumerical, param, metric)
          break
      }

      el.style('stroke-width', chart.shape === 'text' ? 0 : 5)
        .style('stroke', 'rgba(0, 0, 0, 0)')
        .on('mouseover', (event, d: number) => {
          d3.select(event.target)
            .transition(getTransition())
            .style('stroke', 'rgba(200, 200, 200, 1)')
            .style('cursor', 'pointer')
          tooltip.style.setProperty('visibility', 'visible')
          tooltip_ref.value?.setTooltipData({
            title: formatValue(d),
            data: {
              metric: metric,
              cnt: chart.data[param].cnt,
              class: param,
            },
          })
        })
        .on('mousemove', (event: MouseEvent) => {
          const new_location = calcTooltipLocation(tooltip, event)
          tooltip.style.left = `${new_location.left}px`
          tooltip.style.top = `${new_location.top}px`
        })
        .on('mouseout', (event) => {
          d3.select(event.target)
            .transition(getTransition())
            .style('stroke', 'rgba(0, 0, 0, 0)')
          tooltip.style.setProperty('visibility', 'hidden')
        })
        .on('click', (event, d) => {
          switch (chart.shape) {
            case 'rect':
              chart.shape = 'circle'
              break
            case 'circle':
              chart.shape = 'text'
              break
            case 'text':
              chart.shape = 'numerical'
              break
            case 'numerical':
              chart.shape = 'rect'
              break
          }
        })
    }
  }

  // 如果 encode 类型是 numerical，则在图表上添加数值
  for (let i = 0; i < metrics.length; i++) {
    if (chart.shape !== 'numerical') break
    const metric = metrics[i]
    for (const param of params) {
      squares
        .append('text')
        .datum(chart.data[param].metrics[metric])
        .attr('x', x_scale(param) + x_scale.bandwidth() / 2)
        .attr('y', y_scale(metric) + y_scale.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text((d) => formatValue(d))
        .attr(
          'font-size',
          `${Math.min(x_scale.bandwidth(), y_scale.bandwidth()) / 3}px`,
        )
        .attr('font-weight', 'bold')
        .style('fill', '#fff')
    }
  }
}

const initGraph = (metrics_data: MetricsData['params']) => {
  chart.data = metrics_data
  chart.status.loading = true
  drawGraph()
  chart.status.loading = false
}

defineExpose({
  initGraph,
})

watchEffect(() => {
  console.log('🎨 Update HeatMap')
  if (props.data && chart.shape) {
    initGraph(props.data)
  }
})
</script>

<style scoped></style>
