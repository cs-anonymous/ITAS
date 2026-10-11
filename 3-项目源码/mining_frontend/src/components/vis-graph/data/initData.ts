import { RecordData } from '@/types/visualization/data'

import { getOriginData } from './L1-fetch'
import { getPreData } from './L2-pre'
import { initPreData } from './L3-maintain'

export const initData = async (extracted_data: RecordData) => {
  const origin_data = await getOriginData(extracted_data)
  const pre_data = await getPreData(origin_data)
  await initPreData(pre_data)
  return true
}
