import {
  RecordData,
  ParamDict,
  MergedData,
  ParagraphRecord,
} from '@/types/visualization/data'

export const Vis_Data = {
  ready: false,
  labeled: <RecordData>{},
  extracted: <RecordData>{},
  merged: <MergedData>{},
  Param_Dict: <ParamDict>{},
}

export const initPreData = async (pre_data: {
  extracted_data: ParagraphRecord[]
  merged_data: MergedData
  Param_Dict: ParamDict
  labeled_data: ParagraphRecord[]
}) => {
  Vis_Data.labeled = pre_data.labeled_data
  Vis_Data.extracted = pre_data.extracted_data
  Vis_Data.merged = pre_data.merged_data
  Vis_Data.Param_Dict = pre_data.Param_Dict
  Vis_Data.ready = true

  console.log('🧪 Vis_Data', Vis_Data)

  return true
}
