import { ChemEntity, PaperEntitySet } from '@/types/visualization/data'
import { Metrics } from '@/types/visualization/calculation'

import { KEY_NAME_DICT } from '@/components/vis-graph/name_dict.ts'

import { calcMetrics } from '@/components/vis-graph/algorithm/calculate/metrics.ts'

// 返回一个集合，集合中的元素为该数据集包含的所有文章名称
const getAllMofNames = (data: ChemEntity[]): Set<string> => {
  const mof_names = new Set<string>()
  data.forEach((item) => {
    mof_names.add(item[KEY_NAME_DICT.mof_id])
  })
  return mof_names
}

// 根据 MOFs 集合，从原始数据集中提取每个 MOF 的数据，形成 MOF 数据字典
const getMofEntitySet = (
  data: ChemEntity[],
  paper_set: Set<string>,
): Map<string, PaperEntitySet> => {
  const res = new Map<string, PaperEntitySet>()
  data.forEach((item) => {
    if (item.class === 'MOF') return
    const mof_name = item[KEY_NAME_DICT.mof_id]
    if (!paper_set.has(mof_name)) return

    if (mof_name in res) {
      res[mof_name][item.class].add(item[KEY_NAME_DICT.content])
    } else {
      res[mof_name] = {}

      KEY_NAME_DICT.classes.forEach((class_name) => {
        res[mof_name][class_name] = new Set<string>()
      })

      res[mof_name][item.class].add(item[KEY_NAME_DICT.content])
    }
  })
  return res
}

const getMetricsOnMof = (
  set_a: PaperEntitySet,
  set_b: PaperEntitySet,
): Map<string, Metrics> => {
  const res = new Map<string, Metrics>()
  KEY_NAME_DICT.classes.forEach((class_name) => {
    res[class_name] = calcMetrics(set_a[class_name], set_b[class_name])
  })
  return res
}

const convertResDictToArray = (dict_res: Map<string, Metrics>) => {
  const res = []
  for (const metric in dict_res) {
    const temp = { metric: metric }
    for (const key in dict_res[metric]) {
      temp[key] = dict_res[metric][key]
    }
    res.push(temp)
  }
  return res
}

export const getBarData = async (
  ground_truth_data: ChemEntity[],
  extracted_data: ChemEntity[],
) => {
  const ground_truth_mof_names = getAllMofNames(ground_truth_data)
  const extracted_paper_names = getAllMofNames(extracted_data)

  // 两个数据集共有的文章
  const mof_names = new Set(
    [...ground_truth_mof_names].filter((x) => extracted_paper_names.has(x)),
  )

  const ground_truth_entity_set = getMofEntitySet(ground_truth_data, mof_names)

  const extracted_entity_set = getMofEntitySet(extracted_data, mof_names)

  const metrics_on_mofs = new Map<string, Map<string, Metrics>>()

  for (const mof of mof_names) {
    metrics_on_mofs[mof] = getMetricsOnMof(
      ground_truth_entity_set[mof],
      extracted_entity_set[mof],
    )
  }

  const res = {}
  KEY_NAME_DICT.metrics.forEach((metric) => {
    res[metric] = {}
  })

  KEY_NAME_DICT.classes.forEach((class_name) => {
    const nan_cnt = {}
    KEY_NAME_DICT.metrics.forEach((metric) => {
      res[metric][class_name] = 0
      nan_cnt[metric] = 0
    })

    for (const mof of mof_names) {
      for (const metric_name of KEY_NAME_DICT.metrics) {
        if (isNaN(metrics_on_mofs[mof][class_name][metric_name])) {
          nan_cnt[metric_name] += 1
        } else {
          res[metric_name][class_name] +=
            metrics_on_mofs[mof][class_name][metric_name]
        }
      }
    }

    for (const metric_name of KEY_NAME_DICT.metrics) {
      res[metric_name][class_name] /= mof_names.size - nan_cnt[metric_name]
    }
  })

  return res
}
