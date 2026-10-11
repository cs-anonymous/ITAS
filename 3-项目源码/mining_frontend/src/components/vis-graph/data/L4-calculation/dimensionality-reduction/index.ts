import { DataSource, DRMethod } from '@/types/visualization/enum'
import {
  ArrayNum2D,
  Embeddings,
  AllEmbeddings,
} from '@/types/visualization/calculation'

import { getEmbeddingsByDataSource } from '../embedding'

import {
  get_tsne_res,
  get_umap_res,
  get_pca_res,
} from '@/components/vis-graph/algorithm'

// 根据降维方法名称获取数据降维方法
const getDrMethod = (dr_name: DRMethod): Function => {
  switch (dr_name) {
    case DRMethod.TSNE:
      return get_tsne_res
    case DRMethod.UMAP:
      return get_umap_res
    case DRMethod.PCA:
      return get_pca_res
    default:
      return get_tsne_res
  }
}

/**
 * 根据降维方法获取降维后的嵌入结果
 * @param dr_method 降维方法枚举值
 */
export const getDrEmbeddings = async (dr_method: DRMethod) => {
  const embeddings: AllEmbeddings = {
    labeled: getEmbeddingsByDataSource(DataSource.LABELED),
    extracted: getEmbeddingsByDataSource(DataSource.EXTRACTED),
  }

  /**
   * 将嵌入结果展平放一位数组
   * @param type_embedding 某一种来源的嵌入结果
   */
  const flattenEmbedding = (type_embedding: Embeddings) => {
    const para1D: Array<string> = []
    const emb2D: ArrayNum2D = []
    for (const [paragraphId, embedding] of Object.entries(type_embedding)) {
      para1D.push(paragraphId)
      emb2D.push(embedding)
    }
    return { para1D, emb2D }
  }

  const labeled = flattenEmbedding(embeddings.labeled)
  const extracted = flattenEmbedding(embeddings.extracted)

  const dr_func: Function = getDrMethod(dr_method)
  const dr_emb_labeled = await dr_func(labeled.emb2D)
  const dr_emb_extracted =
    extracted.emb2D.length === 0 ? [] : await dr_func(extracted.emb2D)

  const res: AllEmbeddings = {
    labeled: {},
    extracted: {},
  }

  for (let i = 0; i < labeled.para1D.length; i++) {
    res.labeled[labeled.para1D[i]] = dr_emb_labeled[i]
  }
  for (let i = 0; i < extracted.para1D.length; i++) {
    res.extracted[extracted.para1D[i]] = dr_emb_extracted[i]
  }

  console.log('🧪 DR res', res)

  return res
}
