import { Embeddings } from '@/types/visualization/calculation'

// 归一化 embedding
export const normalizeEmbedding = (
  embeddings: Embeddings,
  h_min_values: number[] | undefined = undefined,
  h_max_values: number[] | undefined = undefined,
) => {
  const res: Embeddings = {}

  const embedding_size = Object.values(embeddings)[0].length

  let min_values: number[] = []
  let max_values: number[] = []

  if (h_min_values && h_max_values) {
    min_values = h_min_values
    max_values = h_max_values
  } else {
    // 计算每一维的最大最小值
    min_values = Array(embedding_size).fill(Infinity)
    max_values = Array(embedding_size).fill(-Infinity)
    for (const embedding of Object.values(embeddings)) {
      embedding.forEach((value, index) => {
        if (isNaN(value)) return
        if (value < min_values[index]) {
          min_values[index] = value
        }
        if (value > max_values[index]) {
          max_values[index] = value
        }
      })
    }
  }

  // 归一化
  Object.entries(embeddings).forEach(([paragraphId, embedding]) => {
    res[paragraphId] = embedding.map((value, index) => {
      if (isNaN(value)) return 0
      const min = min_values[index]
      const max = max_values[index]
      return (value - min) / (max - min)
    })
  })

  return {
    res,
    min_values,
    max_values
  }
}
