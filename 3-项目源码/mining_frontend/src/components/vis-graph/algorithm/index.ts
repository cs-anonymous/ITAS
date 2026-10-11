import {
  dr_by_tsne,
  dr_by_umap,
  dr_by_pca,
} from '@/components/vis-graph/algorithm/worker'

import type { ArrayNum2D } from '@/types/visualization/calculation.d.ts'
import { MessagePlugin } from 'tdesign-vue-next'

const ms_to_dot3_s = (time: number): string => {
  return (time / 1000).toFixed(3)
}

export const get_tsne_res = async (data: ArrayNum2D): Promise<number[][]> => {
  const begin_log = `开始数据降维：t-SNE  🧪 Shape：(${data.length}, ${data[0].length})`
  console.log(begin_log)
  await MessagePlugin.info({
    content: begin_log,
    duration: 3000,
  })

  const start_time = performance.now()

  const res = await dr_by_tsne(data)

  const end_time = performance.now()

  const end_log = `t-SNE 计算完成 🎉 耗时：${ms_to_dot3_s(
    end_time - start_time,
  )} 秒`
  console.log(end_log)
  await MessagePlugin.success({
    content: end_log,
    duration: 3000,
  })

  return res
}

/**
 * 输入二维数组，获取降维后的数组
 *
 * 使用方法参考 {@link https://www.npmjs.com/package/umap-js}
 * @param data 二维数组
 */
export const get_umap_res = async (data: ArrayNum2D): Promise<number[][]> => {
  const begin_log = `开始数据降维：UMAP  🧪 Shape：(${data.length}, ${data[0].length})`
  console.log(begin_log)
  await MessagePlugin.info({
    content: begin_log,
    duration: 3000,
  })

  const start_time = performance.now()

  const res = await dr_by_umap(data)

  const end_time = performance.now()

  const end_log = `UMAP 计算完成 🎉 耗时：${ms_to_dot3_s(
    end_time - start_time,
  )} 秒`
  console.log(end_log)
  await MessagePlugin.success({
    content: end_log,
    duration: 3000,
  })

  return res
}

export const get_pca_res = async (data: ArrayNum2D): Promise<number[][]> => {
  const begin_log = `开始数据降维：PCA  🧪 Shape：(${data.length}, ${data[0].length})`
  console.log(begin_log)
  await MessagePlugin.info({
    content: begin_log,
    duration: 3000,
  })

  const start_time = performance.now()

  const res = await dr_by_pca(data)

  const end_time = performance.now()

  const end_log = `PCA 计算完成 🎉 耗时：${ms_to_dot3_s(
    end_time - start_time,
  )} 秒`
  console.log(end_log)
  await MessagePlugin.success({
    content: end_log,
    duration: 3000,
  })

  return res
}
