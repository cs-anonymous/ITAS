import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ResultModel } from '@/types/system'
import { RecordData } from '@/types/visualization/data'

type ServerResult = ResultModel<RecordData>
type LocalResult = AxiosResponse<ResultModel<RecordData>>

import { get } from '@/utils/request'

const DATA_ORIGIN: 'server' | 'local' = 'server'

const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 8000,
})

let total_chem_entity: RecordData | null = null

export const getTotalChemEntityFromLocal = (): Promise<LocalResult> => {
  return request.get('/total')
}

export const getTotalChemEntity = (): Promise<ServerResult> => {
  return get('/marked/list-all')
}

export const getExtractedChemEntity = (): Promise<LocalResult> => {
  return request.get('/extract')
}

// 从服务器获取原始数据
export const getOriginData = async (extracted_data: RecordData) => {
  if (total_chem_entity === null) {
    if (DATA_ORIGIN === ('server' as typeof DATA_ORIGIN)) {
      total_chem_entity = (await getTotalChemEntity()).payload
    } else {
      total_chem_entity = (await getTotalChemEntityFromLocal()).data.payload
    }
  }

  if (DATA_ORIGIN === ('local' as typeof DATA_ORIGIN)) {
    extracted_data = (await getExtractedChemEntity()).data.payload
  }

  return {
    labeled_data: total_chem_entity as RecordData,
    extracted_data,
  }
}
