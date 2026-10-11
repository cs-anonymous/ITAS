import { PCA } from 'ml-pca'
import { normalizeEmbeddings } from './normalize.ts'

let pca_entity: PCA | null = null

/**
 * 对二维数据进行 PCA 降维的底层函数
 *
 * 使用方法参考 {@link https://www.npmjs.com/package/ml-pca}
 *
 * @param data
 */
const pca = (data: number[][]) => {
  if (pca_entity === null) {
    console.log('PCA: create new')
    pca_entity = new PCA(data)
  } else {
    console.log('PCA: use existed')
  }

  return pca_entity.predict(data).to2DArray()
}

export default pca
