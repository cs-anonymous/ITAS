import { ValueType } from './enum'

export type ArrayNum2D = number[][]

export interface MetricCnt {
  // 标注中有，并且抽取正确
  TP: number

  // 标注中没有，并且没有抽取
  TN: number

  // 标注中有，抽取中也有，但是抽取错误
  FP: number

  // 标注中有，但是没有抽取
  FN: number
}

// 4 个指标
export interface Metrics {
  precision: number
  recall: number
  F1: number
  ACC: number
}

export interface PDFResult {
  precision: number[]
  recall: number[]
  F1: number[]
  ACC: number[]
}

export interface MetricResult {
  cnt: MetricCnt
  metrics: Metrics
  pdf?: PDFResult
}

export interface OneMofMetricResult {
  [param: string]: MetricResult
}

export interface AllMofMetricResult {
  [param: string]: MetricResult[]
}

// 送入 embedding 计算器的数据
export interface BeforeCalcEmbedding {
  // 参数名称
  param: string

  // 参数类型
  type: ValueType

  // 合成段数据，仅包含指定参数
  data: {
    [paragraphId: string]: string | number | string[] | number[] | undefined
  }
}

// 合成段的 embedding （所有或某一参数）
export type Embeddings = {
  [paragraphId: string]: number[]
}

// 标注数据与提取数据的 Embedding
export interface AllEmbeddings {
  labeled: Embeddings
  extracted: Embeddings
}

// 用于计算嵌入的参数
export interface EmbeddingCalcParams {
  min_values: number[]
  max_values: number[]
  one_hot_map?: Map<string, number[]>
}

export interface EmbCalcResult {
  embedding: Embeddings
  calc_params: EmbeddingCalcParams
}
