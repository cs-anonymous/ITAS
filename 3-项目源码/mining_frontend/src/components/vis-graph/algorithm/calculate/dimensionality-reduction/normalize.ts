import { ArrayNum2D } from '@/types/visualization/calculation'

const target_size = {
  min_x: -100,
  min_y: -100,
  max_x: 100,
  max_y: 100,
}

/**
 * 单线性插值：将一维线性轴上某一区间内某点的值映射到另一个区间
 * @param origin_min 原区间的最小值
 * @param origin_max 原区间的最大值
 * @param target_min 目标区间的最小值
 * @param target_max 目标区间的最大值
 * @param value 原区间内的某点的值
 */
const interpolate = (
  origin_min: number,
  origin_max: number,
  target_min: number,
  target_max: number,
  value: number,
) => {
  const origin_diff = origin_max - origin_min
  const target_diff = target_max - target_min
  return ((value - origin_min) / origin_diff) * target_diff + target_min
}

// 将嵌入向量映射到某个区间内
export const normalizeEmbeddings = (embeddings: ArrayNum2D) => {
  const { min_x, min_y, max_x, max_y } = embeddings.reduce(
    (res, cur) => {
      return {
        min_x: Math.min(res.min_x, cur[0]),
        min_y: Math.min(res.min_y, cur[1]),
        max_x: Math.max(res.max_x, cur[0]),
        max_y: Math.max(res.max_y, cur[1]),
      }
    },
    {
      min_x: Infinity,
      min_y: Infinity,
      max_x: -Infinity,
      max_y: -Infinity,
    },
  )

  return embeddings.map((embedding: number[]) => {
    return [
      interpolate(
        min_x,
        max_x,
        target_size.min_x,
        target_size.max_x,
        embedding[0],
      ),
      interpolate(
        min_y,
        max_y,
        target_size.min_y,
        target_size.max_y,
        embedding[1],
      ),
    ]
  })
}
