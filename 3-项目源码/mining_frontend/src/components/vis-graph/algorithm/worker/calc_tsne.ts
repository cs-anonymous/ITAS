'use strict'

import tsne from '../calculate/dimensionality-reduction/tsne.ts'

self.onmessage = (e: MessageEvent) => {
  console.log('Worker: t-SNE')
  const res = tsne(e.data)
  self.postMessage(res)
}
