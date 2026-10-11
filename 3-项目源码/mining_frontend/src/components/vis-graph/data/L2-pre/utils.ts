import { ValueType } from '@/types/visualization/enum'
import { RecordData } from '@/types/visualization/data'

// 根据数据类型判断是「量化数据」还是「分类数据」
export const getValueType = (data: string | number | string[]): ValueType => {
  if (data instanceof Number) {
    return ValueType.QUANTITATIVE
  }
  return ValueType.CATEGORICAL
}

// 提取数据集中所有的 mof
export const extractAllMofs = (entity_data: RecordData): Set<string> => {
  const res = new Set<string>()
  entity_data.forEach((paragraph) => {
    if (paragraph.mof) {
      res.add(paragraph.mof)
    }
  })
  return res
}
