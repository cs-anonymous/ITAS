import { MetricResult } from '@/types/visualization/calculation'

/**
 * 合并两个指标结果
 * @param target 目标指标结果
 * @param new_res 新的指标结果
 * @param use_pdf 是否使用 pdf
 */
export const mergeMetricRes = (
  target: MetricResult,
  new_res: MetricResult,
  use_pdf: boolean,
) => {
  target.cnt.TP += new_res.cnt.TP
  target.cnt.TN += new_res.cnt.TN
  target.cnt.FP += new_res.cnt.FP
  target.cnt.FN += new_res.cnt.FN

  if (!use_pdf) return

  for (let i = 0; i < 10; i++) {
    target.pdf!.precision[i] += new_res.pdf!.precision[i]
    target.pdf!.recall[i] += new_res.pdf!.recall[i]
    target.pdf!.F1[i] += new_res.pdf!.F1[i]
    target.pdf!.ACC[i] += new_res.pdf!.ACC[i]
  }
}
