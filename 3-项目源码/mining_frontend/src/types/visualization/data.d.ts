import { ValueType } from './enum'
import { EmbeddingCalcParams } from './calculation'

export type Param =
  | {
      precursor_name: string
      amount: number | string
    }[]
  | string[]

export interface ParagraphRecord {
  mof?: string
  mofId?: string
  paragraphId?: string
  param: {
    Compound_Name?: string[]
    [key: string]: Param
  }
}

// 从服务器获取的原始数据结构
export type RecordData = ParagraphRecord[]

// 某个合成段某个参数的「标注数据」和「提取数据」
export interface MergedParamData {
  labeled: Param | null
  extracted: Param | null
}

// 两个数据集提取的公共部分
export type MergedData = {
  [mof: string]: {
    [param: string]: MergedParamData
  }
}

// 参数数值类型字典
export type ParamDict = {
  [param_name: string]: {
    name: string
    type: ValueType
    calc_params?: EmbeddingCalcParams
  }
}

export interface ChemEntity {
  'txt-name': string
  'mof-id': string
  class: string
  content: string
}

interface PaperEntitySet {
  'M-Precursor': Set<string>
  'O-Precursor': Set<string>
  'S-Precursor': Set<string>
}

export interface ChemEntityDiffSet {
  ground_truth: PaperEntitySet
  extracted: PaperEntitySet
}

export type ChemEntityDiff = Array<Record<string, ChemEntityDiffSet>>
