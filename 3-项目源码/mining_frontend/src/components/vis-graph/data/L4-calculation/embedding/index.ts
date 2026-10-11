import { DataSource } from '@/types/visualization/enum.ts'
import { Embeddings } from '@/types/visualization/calculation'
import { Vis_Data } from '@/components/vis-graph/data/L3-maintain'

import { getParamBeforeCalcEmbedding } from './before'
import { calcParamEmbedding } from '@/components/vis-graph/algorithm/calculate/embedding'

/**
 * 合并「新的嵌入结果」到「原有的嵌入结果」
 * @param res 原有的嵌入结果
 * @param new_embedding 新的嵌入结果
 */
const mergeParamEmbedding = (res: Embeddings, new_embedding: Embeddings) => {
  for (const [paragraphId, embedding] of Object.entries(new_embedding)) {
    if (!res[paragraphId]) {
      res[paragraphId] = embedding
    } else {
      res[paragraphId] = res[paragraphId].concat(embedding)
    }
  }
}

/**
 * 根据「数据来源」获取所有合成段（或 MOF）的 embedding
 * @param data_source 数据来源
 */
export const getEmbeddingsByDataSource = (data_source: DataSource) => {
  const res: Embeddings = {}

  if (data_source === DataSource.EXTRACTED && Vis_Data.extracted.length === 0) {
    return {}
  }

  for (const param_name in Vis_Data.Param_Dict) {
    const param_before_embedding = getParamBeforeCalcEmbedding(
      data_source,
      param_name,
    )
    const param_embedding_res = calcParamEmbedding(
      data_source,
      param_before_embedding,
    )
    if (data_source === DataSource.LABELED) {
      Vis_Data.Param_Dict[param_name].calc_params =
        param_embedding_res.calc_params
    }
    mergeParamEmbedding(res, param_embedding_res.embedding)
  }

  return res
}
