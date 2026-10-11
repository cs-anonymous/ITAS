import {
  Metrics,
  AllMofMetricResult,
  MetricResult,
} from '@/types/visualization/calculation'

import { Vis_Data } from '@/components/vis-graph/data/L3-maintain'

import { getOneMofMetricRes } from './one.ts'
import { mergeMetricRes } from './utils.ts'
import { calcMetricsByCnt } from '@/components/vis-graph/algorithm/calculate/metrics.ts'

export const getAllMofMetrics = (): AllMofMetricResult => {
  const res: AllMofMetricResult = {}

  for (const mof of Object.keys(Vis_Data.merged)) {
    const mof_metric_res = getOneMofMetricRes(mof)
    for (const [param, param_metric_res] of Object.entries(mof_metric_res)) {
      if (res[param] === undefined) {
        res[param] = []
      }
      res[param].push(param_metric_res)
    }
  }

  return res
}

export const calcArrayMetrics = (
  data: MetricResult[],
  has_pdf: boolean,
): MetricResult => {
  const generator = (): number[] => Array(10).fill(0)

  const res: MetricResult = {
    cnt: {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0,
    },
    metrics: <Metrics>{},
    pdf: {
      precision: generator(),
      recall: generator(),
      F1: generator(),
      ACC: generator(),
    },
  }

  for (const item of data) {
    if (has_pdf) {
      mergeMetricRes(res, item, true)
      continue
    }

    mergeMetricRes(res, item, false)
    for (const [metric, value] of Object.entries(item.metrics)) {
      const idx = Math.min(Math.floor(value * 10), 9)
      if (res.pdf) {
        res.pdf[metric as keyof MetricResult['pdf']][idx]++
      }
    }
  }

  res.metrics = calcMetricsByCnt(res.cnt)

  return res
}
