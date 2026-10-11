import TsneWorker from './calc_tsne.ts?worker'
import UmapWorker from './calc_umap.ts?worker'
import PcaWorker from './calc_pca.ts?worker'

import { callWorker } from '@/utils/worker.ts'
import { ArrayNum2D } from '@/types/visualization/calculation'

const tsne_worker = new TsneWorker()
const umap_worker = new UmapWorker()
const pca_worker = new PcaWorker()

export const dr_by_tsne = async (data: ArrayNum2D): Promise<number[][]> => {
  return await callWorker(tsne_worker, data) as Promise<number[][]>
}

export const dr_by_umap = async (data: ArrayNum2D): Promise<number[][]> => {
  return await callWorker(umap_worker, data) as Promise<number[][]>
}

export const dr_by_pca = async (data: ArrayNum2D): Promise<number[][]> => {
  return await callWorker(pca_worker, data) as Promise<number[][]>
}
