import { Param, MergedParamData } from '@/types/visualization/data'
import {
  MetricCnt,
  OneMofMetricResult,
} from '@/types/visualization/calculation'

import { Vis_Data } from '@/components/vis-graph/data/L3-maintain'

import {
  get_TFPN_cnt,
  calcMetricsByCnt,
} from '@/components/vis-graph/algorithm/calculate/metrics.ts'

import { removeSpecialCharacters } from '../utils.ts'

const convertToSimpleClearSet = (data: string[]): Set<string> => {
  const res = new Set<string>()
  for (const item of data) {
    res.add(removeSpecialCharacters(item))
  }
  return res
}

const convertToSet = (data: Param): Set<string | number> => {
  const str_lst: string[] = []
  for (const item of data) {
    if (typeof item === 'object') {
      const name = removeSpecialCharacters(item.precursor_name)
      const amount = removeSpecialCharacters(`${item.amount}`)
      str_lst.push(`${name}=-=${amount}`)
    } else {
      str_lst.push(removeSpecialCharacters(item))
    }
  }
  str_lst.sort()
  return new Set([str_lst.join('$-$')])
}

/**
 * 获取某个合成段某个参数的「TP, TN, FP, FN」
 * @param param_name 参数名
 * @param param_data 参数数据
 */
const getParamMetricCnt = (
  param_name: string,
  param_data: MergedParamData,
): MetricCnt => {
  const labeled_data = param_data.labeled
  const extracted_data = param_data.extracted

  if (labeled_data === null) {
    if (extracted_data === null) {
      return {
        TP: 0,
        TN: 1,
        FP: 0,
        FN: 0,
      }
    }
    return {
      TP: 0,
      TN: 0,
      FP: 1,
      FN: 0,
    }
  }

  if (extracted_data === null) {
    return {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 1,
    }
  }

  // 如果是化合物名：抽取结果(大模型结果)和标注数据(人工标注结果)里有一个相同就算 TP
  if (param_name === 'Compound_Name') {
    const res = {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0,
    }

    const labeled_set = convertToSimpleClearSet(labeled_data as string[])
    const extracted_set = convertToSimpleClearSet(extracted_data as string[])
    const shared = new Set([...labeled_set].filter((x) => extracted_set.has(x)))

    if (shared.size > 0) {
      res.TP = 1
    } else {
      res.FP = 1
    }

    return res
  }

  return get_TFPN_cnt(convertToSet(labeled_data), convertToSet(extracted_data))
}

export const getOneMofMetricRes = (mof: string): OneMofMetricResult => {
  const data = Vis_Data.merged[mof]

  const res: OneMofMetricResult = {}
  for (const param_name of Object.keys(Vis_Data.Param_Dict)) {
    const metric_cnt = getParamMetricCnt(param_name, data[param_name])
    const metrics = calcMetricsByCnt(metric_cnt)
    res[param_name] = {
      cnt: metric_cnt,
      metrics,
    }
  }

  return res
}
