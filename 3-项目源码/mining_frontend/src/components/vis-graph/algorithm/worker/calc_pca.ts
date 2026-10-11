'use strict'

import pca from '../calculate/dimensionality-reduction/pca.ts'

self.onmessage = (e: MessageEvent) => {
  console.log('Worker: PCA')
  const res = pca(e.data)
  self.postMessage(res)
}
