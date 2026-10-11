import { PDFResult, MetricResult } from '@/types/visualization/calculation'
import { MetricsData } from '@/types/visualization/graph'

import { getAllMofMetrics, calcArrayMetrics } from '../L4-calculation/metric'

export const getMetrics = (): MetricsData => {
  const all_mof_metrics = getAllMofMetrics()
  const all_metrics_list: MetricResult[] = []

  const res_params: MetricsData['params'] = {}
  for (const [param, param_mof_list] of Object.entries(all_mof_metrics)) {
    const param_metric = calcArrayMetrics(param_mof_list, false)
    res_params[param] = {
      cnt: param_metric.cnt,
      metrics: param_metric.metrics,
      pdf: param_metric.pdf as PDFResult,
    }
    all_metrics_list.push(param_metric)
  }

  const all_metrics = calcArrayMetrics(all_metrics_list, true)

  return {
    total: {
      cnt: all_metrics.cnt,
      metrics: all_metrics.metrics,
      pdf: all_metrics.pdf as PDFResult,
    },
    params: res_params,
  }
}
