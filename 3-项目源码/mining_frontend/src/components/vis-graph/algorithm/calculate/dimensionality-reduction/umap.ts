/**
 * UMAP 算法
 *
 * 升级 Vite 版本后，无法使用 seedrandom 库；
 * 由于 UMAP 算法的随机性，导致每次运行结果不一致，使用这个库也无法解决。
 */

import { UMAP } from 'umap-js'
// import * as seedrandom from 'seedrandom'
import { normalizeEmbeddings } from './normalize.ts'

let umap_entity: UMAP | null = null

const umap = (data: number[][]) => {
  if (umap_entity) {
    console.log('UMAP: use existed')
    return umap_entity.transform(data)
  }

  console.log('UMAP: create new')
  umap_entity = new UMAP({
    nComponents: 2,
    // 此参数会导致 transform 计算卡死，也可能是时间过长
    // nEpochs: 500,
    // random: seedrandom('umap'),
    nNeighbors: 15,
  })
  return umap_entity.fit(data)
}

export default umap
