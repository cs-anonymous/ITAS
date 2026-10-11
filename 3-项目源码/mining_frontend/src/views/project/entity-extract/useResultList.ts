import { ExtractResult } from '@/types/system'
import { computed, ref } from 'vue'
import { listResultByTask } from '@/apis/result'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRouter } from 'vue-router'

export function useResultList() {
  const resultList = ref<ExtractResult[]>()
  const resultLoading = ref(false)
  const currentResult = ref<ExtractResult>()
  const selectedPara = ref<ExtractResult[]>()
  const router = useRouter()
  const getResultList = (id: string) => {
    if (id) {
      resultLoading.value = true
      listResultByTask(id)
        .then((res) => {
          resultList.value = res.payload
          selectedPara.value = res.payload
          if (resultList.value.length > 0) {
            currentResult.value = resultList.value[0]
          } else {
            MessagePlugin.warning(
              '该任务目前暂无抽取结果，请返回稍等或重新创建任务',
            )
            setTimeout(() => {
              router.push({
                name: 'synthesisParagraph',
              })
            }, 1000)
          }
        })
        .finally(() => {
          resultLoading.value = false
        })
    }
  }
  return {
    resultList,
    resultLoading,
    getResultList,
    currentResult,
    selectedPara,
  }
}
