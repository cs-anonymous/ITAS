import { DataSource, DRMethod } from '@/types/visualization/enum'
import { AllEmbeddings } from '@/types/visualization/calculation'
import { ParagraphRecord } from '@/types/visualization/data'
import { ParagraphDRData } from '@/types/visualization/graph'

import { Vis_Data } from '../L3-maintain'

import { getDrEmbeddings } from '../L4-calculation/dimensionality-reduction'

const getScatterDataFromRecord = (
  data: ParagraphRecord,
  type: DataSource,
  all_dr_embeddings: AllEmbeddings,
): ParagraphDRData => {
  const mof = data.mof as string
  const embedding = all_dr_embeddings[type][mof]

  if (embedding === undefined) {
    console.log(
      `⚠️ Embedding not found for MOF: ${mof}, corresponding [${type}] data is:`,
      all_dr_embeddings[type],
    )
  }

  return {
    mof,
    shared: mof in Vis_Data.merged,
    type,
    params: data.param,
    embedding: {
      x: embedding[0],
      y: embedding[1],
    },
  }
}

export const getEmbeddings = async (
  dr_method: DRMethod,
): Promise<ParagraphDRData[]> => {
  const res: ParagraphDRData[] = []
  const all_dr_embeddings = await getDrEmbeddings(dr_method)

  console.log('🧪 DR embeddings', all_dr_embeddings)

  for (const paragraph of Vis_Data.labeled) {
    res.push(
      getScatterDataFromRecord(
        paragraph,
        DataSource.LABELED,
        all_dr_embeddings,
      ),
    )
  }
  for (const paragraph of Vis_Data.extracted) {
    res.push(
      getScatterDataFromRecord(
        paragraph,
        DataSource.EXTRACTED,
        all_dr_embeddings,
      ),
    )
  }

  return res
}
