import { MetricResult } from '@/types/visualization/calculation'
import { RecordData } from '@/types/visualization/data'
import { MetricsData } from '@/types/visualization/graph'

import { ref } from 'vue'

import { initData } from '@/components/vis-graph/data/initData.ts'
import { getMetrics } from '@/components/vis-graph/data/L5-application'

export const useVisualization = () => {
  const general_metrics = ref<
    MetricResult | Record<string, Record<string, string>>
  >({
    metrics: {
      precision: '--',
      recall: '--',
      F1: '--',
      ACC: '--',
    },
  })

  const params_metrics = ref<MetricsData['params']>({})

  const vis_data_ready = ref(false)

  const updateVisData = (extracted_data: RecordData) => {
    vis_data_ready.value = false
    initData(extracted_data).then(() => {
      const metrics = getMetrics()
      general_metrics.value = metrics.total
      params_metrics.value = metrics.params
      vis_data_ready.value = true
    })
  }

  return {
    general_metrics,
    params_metrics,
    vis_data_ready,
    updateVisData,
  }
}
