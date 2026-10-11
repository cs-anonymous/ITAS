import {
  BeforeCalcEmbedding,
  EmbeddingCalcParams,
  Embeddings,
} from '@/types/visualization/calculation'

import { getOneHotFromSet } from './one_hot.ts'
import { normalizeEmbedding } from './normalize'
import { Vis_Data } from '@/components/vis-graph/data/L3-maintain'

// 向量相加: left += right
const addVectorRight2Left = (left: number[], right: number[]) => {
  if (right === undefined) return
  const len = left.length
  for (let i = 0; i < len; i++) {
    left[i] += right[i]
  }
}

/**
 * 获取所有字符串 の one-hot 编码
 * @param before_embedding_data 嵌入计算前的数据
 */
const getOneHotMap = (before_embedding_data: BeforeCalcEmbedding) => {
  // 获取所有字符串集合
  const all_str_set = new Set<string>()
  for (const value of Object.values(before_embedding_data.data)) {
    if (typeof value === 'string') {
      all_str_set.add(value)
    } else if (
      Array.isArray(value) &&
      value.every((item): item is string => typeof item === 'string')
    ) {
      value.forEach((s) => all_str_set.add(s))
    }
  }
  return getOneHotFromSet(all_str_set)
}

/**
 * 计算「分类型」嵌入
 * @param before_embedding_data 嵌入计算前的数据
 * @param use_history 是否使用历史数据
 */
export const calcCategoricalEmbedding = (
  before_embedding_data: BeforeCalcEmbedding,
  use_history = false,
) => {
  const { data } = before_embedding_data

  const calc_params = Vis_Data.Param_Dict[before_embedding_data.param]
    .calc_params as EmbeddingCalcParams

  // 所有字符串 の one-hot 编码
  const one_hot_map = use_history
    ? (Vis_Data.Param_Dict[before_embedding_data.param].calc_params
        ?.one_hot_map as Map<string, number[]>)
    : getOneHotMap(before_embedding_data)

  // 生成 embedding
  const embeddings: Embeddings = {}
  for (const [paragraphId, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      embeddings[paragraphId] = one_hot_map.get(value) as number[]
    } else if (
      Array.isArray(value) &&
      value.every((item): item is string => typeof item === 'string')
    ) {
      const embedding: number[] = Array(one_hot_map.size).fill(0)
      value.forEach((s) =>
        addVectorRight2Left(embedding, one_hot_map.get(s) as number[]),
      )
      embeddings[paragraphId] = embedding
    } else {
      embeddings[paragraphId] = Array(one_hot_map.size).fill(0)
    }
  }

  const { res, min_values, max_values } = use_history
    ? normalizeEmbedding(
        embeddings,
        calc_params.min_values,
        calc_params.max_values,
      )
    : normalizeEmbedding(embeddings)

  return {
    embedding: res,
    calc_params: {
      min_values,
      max_values,
      one_hot_map,
    },
  }
}
