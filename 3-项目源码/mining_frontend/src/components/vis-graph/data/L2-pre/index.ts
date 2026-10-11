import { DataSource, ValueType } from '@/types/visualization/enum'
import {
  ParagraphRecord,
  MergedData,
  ParamDict,
  RecordData,
} from '@/types/visualization/data'

import { extractAllMofs } from './utils.ts'

// 'Compound_Name' as keyof ParagraphRecord['param']

/**
 * 将输入的原始数据中每个合成段的参数名添加到 Param_Dict 中
 * @param entity_data 原始记录数据
 * @param Param_Dict 参数信息字典
 *
 * @note 由于目前数据集中所有的量都是数值加单位的形式，所以暂时不需要考虑数据类型，统一为 ValueType.CATEGORICAL
 */
const countParamKeys = (entity_data: RecordData, Param_Dict: ParamDict) => {
  for (const paragraph of entity_data) {
    for (const key of Object.keys(paragraph.param)) {
      Param_Dict[key] = {
        name: key,
        type: ValueType.CATEGORICAL,
      }
    }
  }
}

/**
 * 根据共有的 MOF 集合，将对应的「记录数据」添加到「合并数据」中
 * @param merged_data 合并数据
 * @param all_shared_mof 共有的 MOF 集合
 * @param Param_Dict 参数信息字典
 * @param record_data 记录数据
 * @param type 「标注数据」还是「提取数据」
 */
const parseMergedData = (
  merged_data: MergedData,
  all_shared_mof: Set<string>,
  Param_Dict: ParamDict,
  record_data: RecordData,
  type: DataSource,
) => {
  for (const paragraph of record_data) {
    const mof = <string>paragraph.mof
    if (!all_shared_mof.has(mof)) continue

    // 初始化
    if (merged_data[mof] === undefined) {
      merged_data[mof] = {}
    }

    for (const param_name of Object.keys(Param_Dict)) {
      // 初始化
      if (merged_data[mof][param_name] === undefined) {
        merged_data[mof][param_name] = {
          labeled: null,
          extracted: null,
        }
      }
      if (param_name in paragraph.param) {
        merged_data[mof][param_name][type] = paragraph.param[param_name]
      } else {
        merged_data[mof][param_name][type] = null
      }
    }
  }
}

/**
 * 将合成段原始数据中 Compound_Name 字段 转换为 位于第一层 mof 字段
 * @param record_data 合成段原始数据
 */
const convertKeyCompoundToMof = (record_data: RecordData) => {
  for (const i in record_data) {
    let paragraph = record_data[i]

    let mof = ''
    if ('markedResults' in paragraph) {
      if (paragraph['markedResults'] && 'mofId' in paragraph['markedResults']) {
        mof = (paragraph.markedResults as { mofId: string }).mofId
      } else {
        if ('Compound_Name' in paragraph.results.param) {
          mof = paragraph.results.param.Compound_Name[0]
        } else {
          mof = paragraph.results.paragraphId
        }
      }
    } else {
      mof = paragraph.mofId as string
    }

    if (mof === '') {
      console.log('‼️ mof 为空')
    }

    if ('results' in paragraph) {
      record_data[i] = paragraph.results as ParagraphRecord
      paragraph = record_data[i]
    }

    paragraph.mof = mof

    // 删除 compound_name 字段
    // 2024 年 3 月 18 日：后续采用合成段 id 直接匹配，不再通过该字段匹配
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { Compound_Name, ...rest } = paragraph.param
    // paragraph.param = { ...rest }

    // 将 param 中的 name 和 amount 拆开
    const new_param: Record<string, string[]> = {}
    for (const [key, value] of Object.entries(paragraph.param)) {
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'string'
      ) {
        new_param[key] = value as string[]
      } else {
        const names: string[] = []
        const amounts: string[] = []
        for (const item of value) {
          names.push(item.precursor_name as string)
          amounts.push(`${item.amount}`)
        }
        new_param[`${key}.name`] = names
        new_param[`${key}.amount`] = amounts
      }
    }

    paragraph.param = new_param
  }
}

// 获取预处理后的数据
export const getPreData = async (
  origin_data: Record<'labeled_data' | 'extracted_data', RecordData>,
) => {
  const { labeled_data, extracted_data } = origin_data

  convertKeyCompoundToMof(labeled_data)
  convertKeyCompoundToMof(extracted_data)

  const Param_Dict: ParamDict = {}

  countParamKeys(labeled_data, Param_Dict)
  countParamKeys(extracted_data, Param_Dict)

  // 提取两个数据集的公共部分
  const all_labeled_mof = extractAllMofs(labeled_data)
  const all_extracted_mof = extractAllMofs(extracted_data)

  const all_shared_mof = new Set(
    [...all_extracted_mof].filter((x) => all_labeled_mof.has(x)),
  )

  console.log('🧪 All shared MOF', all_shared_mof)

  const merged_data: MergedData = {}
  parseMergedData(
    merged_data,
    all_shared_mof,
    Param_Dict,
    labeled_data,
    DataSource.LABELED,
  )
  parseMergedData(
    merged_data,
    all_shared_mof,
    Param_Dict,
    extracted_data,
    DataSource.EXTRACTED,
  )

  return {
    labeled_data,
    extracted_data,
    merged_data,
    Param_Dict,
  }
}
