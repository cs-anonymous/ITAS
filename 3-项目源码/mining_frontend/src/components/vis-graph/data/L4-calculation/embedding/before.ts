import { Vis_Data } from '@/components/vis-graph/data/L3-maintain'

import { DataSource } from '@/types/visualization/enum'
import { Param, RecordData } from '@/types/visualization/data'
import { BeforeCalcEmbedding } from '@/types/visualization/calculation'

import { removeSpecialCharacters } from '../utils.ts'

/**
 * 将「参数数据」中所有的值转换为「字符串」，并以「字符串列表」形式返回
 * @param param 参数数据
 */
const convertParamToStringList = (param: Param): string[] | undefined => {
  if (param === undefined) return undefined
  const res: string[] = []
  for (const item of param) {
    if (typeof item === 'object') {
      res.push(removeSpecialCharacters(item.precursor_name))
      res.push(removeSpecialCharacters(`${item.amount}`))
    } else {
      res.push(removeSpecialCharacters(item))
    }
  }
  return res
}

/**
 * 根据「参数名称」从「合成段数据」中提取「参数数据」并加载到「嵌入计算前的数据」中
 * @param res 提取后的数据存放位置
 * @param param_name 指定参数名称
 * @param entity_data 合成段数据
 */
const loadParamToBeforeEmbedding = (
  res: BeforeCalcEmbedding,
  param_name: string,
  entity_data: RecordData,
) => {
  for (const paragraph of entity_data) {
    const mof = <string>paragraph.mof
    res.data[mof] = convertParamToStringList(paragraph.param[param_name])
  }
}

/**
 * 根据「数据来源」和「参数名称」获取「嵌入计算前的数据」
 * @param data_source 数据来源
 * @param param_name 指定参数名称
 */
export const getParamBeforeCalcEmbedding = (
  data_source: DataSource,
  param_name: string,
): BeforeCalcEmbedding => {
  const res: BeforeCalcEmbedding = {
    param: param_name,
    type: Vis_Data.Param_Dict[param_name].type,
    data: {},
  }

  if (data_source === DataSource.LABELED) {
    loadParamToBeforeEmbedding(res, param_name, Vis_Data.labeled)
  } else if (data_source === DataSource.EXTRACTED) {
    loadParamToBeforeEmbedding(res, param_name, Vis_Data.extracted)
  }

  return res
}
