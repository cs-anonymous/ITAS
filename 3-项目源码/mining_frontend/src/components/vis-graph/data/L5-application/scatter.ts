import { Embedding, Mof, Paper } from '@/types/visualization/graph'
import { KEY_NAME_DICT } from '@/components/vis-graph/name_dict.ts'

import { get_mof_data_one_hot } from '@/components/vis-graph/algorithm/calculate/embedding/one_hot.ts'
import { get_tsne_res, get_umap_res } from '@/components/vis-graph/algorithm'

/**
 * @deprecated 嵌入空间已固定为 MOF，不再使用 Paper 来计算散点图
 */
const get_scatter_paper_data = (
  origin_mof_data,
  embedding: Array<Embedding>,
  paper_map: Map<string, number>,
): Array<Paper> => {
  const res_map = new Map<number, Paper>()

  for (const record of origin_mof_data) {
    const paper_name = record[KEY_NAME_DICT.paper_id]
    const paper_idx = paper_map[paper_name]

    const mof_id = record[KEY_NAME_DICT.mof_id]

    if (paper_idx in res_map) {
      res_map[paper_idx].MOFs.add(mof_id)
    } else {
      res_map[paper_idx] = {
        paper_name,
        MOFs: new Set([mof_id]),
        embedding: {
          x: embedding[paper_idx][0],
          y: embedding[paper_idx][1],
        },
      }
    }
  }

  const res = []
  for (const i in res_map) {
    res.push(res_map[i])
  }

  return res
}

const get_scatter_mof_data = (
  all_mof_map: Map<string, number>,
  embedding: Array<Embedding>,
): Array<Mof> => {
  const res = []

  for (const mof_id in all_mof_map) {
    const mof_idx = all_mof_map[mof_id]
    res.push({
      mof_id,
      embedding: {
        x: embedding[mof_idx][0],
        y: embedding[mof_idx][1],
      },
    })
  }

  return res
}

/**
 * 根据降维方法名称获取数据降维方法
 * @param dr_name 降维方法名称
 * @deprecated 已重构
 */
const get_dimensionality_reduction_method = (dr_name): Function => {
  switch (dr_name) {
    case 'tsne':
      return get_tsne_res
    case 'umap':
      return get_umap_res
    default:
      return get_tsne_res
  }
}

/**
 * 获取绘制散点图所需数据
 * @param chem_entity_data 通过接口获取的原始（或简单处理后的）标注（或由 GPT 生成的）数据
 * @param dr_method_name 降维方法名称
 * @deprecated
 */
export const get_scatter_data = async (chem_entity_data, dr_method_name) => {
  const one_hot_data = get_mof_data_one_hot(chem_entity_data)

  const dr_method = get_dimensionality_reduction_method(dr_method_name)

  const embedding = await dr_method(one_hot_data.one_hot_matrix)

  return get_scatter_mof_data(one_hot_data.all_mof_map, embedding)
}
