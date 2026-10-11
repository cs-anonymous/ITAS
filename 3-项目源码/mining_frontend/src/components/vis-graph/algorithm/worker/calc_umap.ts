'use strict'

import umap from '../calculate/dimensionality-reduction/umap.ts'

self.onmessage = (e: MessageEvent) => {
  console.log('Worker: UMAP')
  const res = umap(e.data)
  self.postMessage(res)
}
