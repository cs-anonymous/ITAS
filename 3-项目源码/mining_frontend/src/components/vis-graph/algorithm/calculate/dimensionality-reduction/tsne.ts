import tsnejs from 'tsne'

const opt = { perplexity: 20, epsilon: 10 }
// epsilon is learning rate (10 = default)

let tsne_entity: typeof tsnejs.tSNE | null = null

const tsne = (data: number[][]) => {
  if (tsne_entity === null) {
    tsne_entity = new tsnejs.tSNE(opt)
  }
  // create a tSNE instance

  // initialize data. Here we have 3 points and some example pairwise dissimilarities
  tsne_entity.initDataDist(data)

  for (let k = 0; k < 500; k++) {
    tsne_entity.step()
    // every time you call this, solution gets better
  }

  // Y is an array of 2-D points that you can plot
  return tsne_entity.getSolution()
}

export default tsne
