import type { ArrayNum2D } from '@/types/visualization/calculation.d.ts'
import { KEY_NAME_DICT } from '@/components/vis-graph/name_dict.ts'

const get_unique_array = (arr: Array<number | string>) => {
  // arr = arr.filter((item, index) => arr.indexOf(item) === index)
  arr = Array.from(new Set(arr))
  return arr
}

const get_map_from_array = (arr: Array<number | string>) => {
  const map = {}
  arr.forEach((e, i) => {
    map[e] = i
  })
  return map
}

const create_2D_array = (rows: number, cols: number): ArrayNum2D => {
  return Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0))
}

/**
 * @description: 根据字符串集合生成每个字符串的 one-hot 编码
 * @param str_set 字符串集合
 * @returns one-hot 编码字典
 */
export const getOneHotFromSet = (
  str_set: Set<string>,
): Map<string, number[]> => {
  const str_list = Array.from(str_set)
  const str_list_len = str_list.length
  const one_hot_map = new Map<string, number[]>()
  for (let i = 0; i < str_list_len; i++) {
    const one_hot = Array(str_list_len).fill(0)
    one_hot[i] = 1
    one_hot_map.set(str_list[i], one_hot)
  }
  return one_hot_map
}

/**
 * @description: 从 paper 数据中获取 one-hot 矩阵
 * @param mof_data 原始 MOF 数据
 * @deprecated 嵌入空间已固定为 MOF，不再使用 Paper 来计算散点图
 */
export const get_paper_data_one_hot = (mof_data) => {
  const all_chem_entity = mof_data.map((e) => e.content)
  const unique_encode_name = get_unique_array(
    all_chem_entity.concat(KEY_NAME_DICT.classes),
  )
  const encode_name_map = get_map_from_array(unique_encode_name)
  const encode_name_cnt = unique_encode_name.length

  let all_paper = mof_data.map((e) => e[KEY_NAME_DICT.paper_id])
  all_paper = get_unique_array(all_paper)
  const all_paper_map = get_map_from_array(all_paper)
  const paper_cnt = all_paper.length

  const one_hot_matrix = create_2D_array(paper_cnt, encode_name_cnt)

  for (const record of mof_data) {
    if (KEY_NAME_DICT.classes.indexOf(record[KEY_NAME_DICT.class_name]) === -1)
      continue
    const paper_idx = all_paper_map[record[KEY_NAME_DICT.paper_id]]
    const class_idx = encode_name_map[record[KEY_NAME_DICT.class_name]]
    const chem_entity_idx = encode_name_map[record.content]
    one_hot_matrix[paper_idx][chem_entity_idx] += 1
    one_hot_matrix[paper_idx][class_idx] += 1
  }

  return {
    one_hot_matrix,
    all_paper_map,
    encode_name_map,
  }
}

/**
 * @description: 从 MOF 数据中获取 one-hot 矩阵
 * @param chem_entity_data
 * @deprecated
 */
export const get_mof_data_one_hot = (chem_entity_data) => {
  const all_chem_entity = chem_entity_data.map((e) => e.content)
  const unique_encode_name = get_unique_array(
    all_chem_entity.concat(KEY_NAME_DICT.classes),
  )
  const encode_name_map = get_map_from_array(unique_encode_name)
  const encode_name_cnt = unique_encode_name.length

  let all_mof = chem_entity_data.map((e) => e[KEY_NAME_DICT.mof_id])
  all_mof = get_unique_array(all_mof)
  const all_mof_map = get_map_from_array(all_mof)
  const mof_cnt = all_mof.length

  const one_hot_matrix = create_2D_array(mof_cnt, encode_name_cnt)

  for (const record of chem_entity_data) {
    if (KEY_NAME_DICT.classes.indexOf(record[KEY_NAME_DICT.class_name]) === -1) continue
    const mof_idx = all_mof_map[record[KEY_NAME_DICT.mof_id]]
    const class_idx = encode_name_map[record[KEY_NAME_DICT.class_name]]
    const chem_entity_idx = encode_name_map[record.content]
    one_hot_matrix[mof_idx][chem_entity_idx] += 1
    one_hot_matrix[mof_idx][class_idx] += 1
  }

  return {
    one_hot_matrix,
    all_mof_map,
    encode_name_map,
  }
}
