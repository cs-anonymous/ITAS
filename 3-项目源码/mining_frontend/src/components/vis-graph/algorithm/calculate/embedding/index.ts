import { DataSource, ValueType } from '@/types/visualization/enum'
import {
  BeforeCalcEmbedding,
  EmbCalcResult,
} from '@/types/visualization/calculation'

import { calcNumericalEmbedding } from './numerical.ts'
import { calcCategoricalEmbedding } from './categorical.ts'

/**
 * 根据「数据来源」和「嵌入计算前的数据」计算「嵌入数据」
 * @param data_source 数据来源
 * @param before_embedding_data 嵌入计算前的数据
 */
export const calcParamEmbedding = (
  data_source: DataSource,
  before_embedding_data: BeforeCalcEmbedding,
): EmbCalcResult => {
  // 只有在计算「提取数据」时才使用历史数据进行嵌入计算
  const use_history = data_source === DataSource.EXTRACTED

  if (before_embedding_data.type === ValueType.QUANTITATIVE) {
    return calcNumericalEmbedding(before_embedding_data, use_history)
  }
  return calcCategoricalEmbedding(before_embedding_data, use_history)
}
