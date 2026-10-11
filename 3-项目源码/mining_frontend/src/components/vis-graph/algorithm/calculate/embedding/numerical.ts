import {
  BeforeCalcEmbedding,
  Embeddings,
  EmbeddingCalcParams,
  EmbCalcResult,
} from '@/types/visualization/calculation'
import { normalizeEmbedding } from './normalize'
import { Vis_Data } from '@/components/vis-graph/data/L3-maintain'

/**
 * 不使用历史数据计算新的嵌入
 * @param before_embedding_data 嵌入计算前的数据
 */
const calcOldEmbedding = (before_embedding_data: BeforeCalcEmbedding) => {
  const res_emb: Embeddings = {}

  Object.entries(before_embedding_data).forEach(([paragraphId, value]) => {
    if (typeof value === 'number') {
      // 处理单个数值
      res_emb[paragraphId] = [value]
    } else if (
      Array.isArray(value) &&
      value.every((item): item is number => typeof item === 'number')
    ) {
      // 处理数字数组，取平均值
      const averageValue =
        value.reduce((sum, num) => sum + num, 0) / value.length
      res_emb[paragraphId] = [averageValue]
    } else {
      res_emb[paragraphId] = [NaN]
    }
  })

  return normalizeEmbedding(res_emb)
}

/**
 * 使用历史数据计算新的嵌入
 * @param before_embedding_data 嵌入计算前的数据
 */
const calcNewEmbedding = (before_embedding_data: BeforeCalcEmbedding) => {
  const res_emb: Embeddings = {}
  const calc_params = Vis_Data.Param_Dict[before_embedding_data.param].calc_params as EmbeddingCalcParams

  // 使用历史数据计算归一化后的数值
  const calcNormalizeUseHistory = (x: number) => {
    const min = calc_params.min_values[0]
    const max = calc_params.max_values[0]
    return (x - min) / (max - min)
  }

  Object.entries(before_embedding_data).forEach(([paragraphId, value]) => {
    if (typeof value === 'number') {
      // 处理单个数值
      res_emb[paragraphId] = [calcNormalizeUseHistory(value)]
    } else if (
      Array.isArray(value) &&
      value.every((item): item is number => typeof item === 'number')
    ) {
      // 处理数字数组，取平均值
      const averageValue =
        value.reduce((sum, num) => sum + num, 0) / value.length
      res_emb[paragraphId] = [calcNormalizeUseHistory(averageValue)]
    } else {
      res_emb[paragraphId] = [0]
    }
  })

  return {
    res: res_emb,
    min_values: calc_params.min_values,
    max_values: calc_params.max_values,
  }
}

/**
 * 计算数值型嵌入
 * @param before_embedding_data 嵌入计算前的数据
 * @param use_history 是否使用历史数据
 */
export const calcNumericalEmbedding = (
  before_embedding_data: BeforeCalcEmbedding,
  use_history = false,
): EmbCalcResult => {
  const { res, min_values, max_values } = use_history ? calcNewEmbedding(before_embedding_data) : calcOldEmbedding(before_embedding_data)

  return {
    embedding: res,
    calc_params: {
      min_values,
      max_values,
    },
  }
}
