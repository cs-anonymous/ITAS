import { MetricCnt, Metrics } from '@/types/visualization/calculation'

/**
 * 根据 真实值 和 预测值 计算 TP（真正例）、FP（假正例）、FN（假负例） 的数量
 * @param ground_truth 真实值集合
 * @param prediction 预测值集合
 *
 * 如果使用集合数量，那么需要考虑 FN，反注释有关 FN 的行即可。
 */
export const get_TFPN_cnt = (
  ground_truth: Set<string | number>,
  prediction: Set<string | number>,
): MetricCnt => {
  const TP = new Set([...ground_truth].filter((x) => prediction.has(x)))
  const FP = new Set([...prediction].filter((x) => !ground_truth.has(x)))
  // const FN = new Set([...ground_truth].filter((x) => !prediction.has(x)))
  return {
    TP: TP.size,
    TN: 0,
    FP: FP.size,
    FN: 0,
    // FN: FN.size,
  }
}

export const calcMetricsByCnt = (cnt_data: MetricCnt): Metrics => {
  const { TP, TN, FP, FN } = cnt_data
  const precision = TP + FP > 0 ? TP / (TP + FP) : NaN

  const recall = TP + FN > 0 ? TP / (TP + FN) : NaN

  const F1 =
    precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : NaN

  const ACC = TP + TN + FP + FN > 0 ? (TP + TN) / (TP + TN + FP + FN) : NaN

  return {
    precision,
    recall,
    F1,
    ACC,
  }
}

/**
 * 根据 真实值 和 预测值 计算 precision（精确率）、recall（召回率）、F1（F1值）
 * @param ground_truth 真实值集合
 * @param prediction 预测值集合
 */
export const calcMetrics = (
  ground_truth: Set<string | number>,
  prediction: Set<string | number>,
): Metrics => {
  const m_set_cnt = get_TFPN_cnt(ground_truth, prediction)
  return calcMetricsByCnt(m_set_cnt)
}
