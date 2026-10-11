import { onMounted, onUnmounted, ref } from 'vue'
import { listFinishPaperByProject, listPaperByProject } from '@/apis/paper'
import type { Paper } from '@/types/system'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { PaperStatus } from '@/types/enum.ts'
import { MessagePlugin } from 'tdesign-vue-next'

export function usePaperList() {
  const paperList = ref<Paper[]>([])
  const finishPaperList = ref<Paper[]>([])
  const selectedPaper = ref<Paper>()
  const route = useRoute()
  const paperLoading = ref(true)
  const isFetching = ref(true)
  const unFinish = ref(false)
  const quickLoading = ref(true)
  const router = useRouter()
  const timerId = ref()

  const fetchData = () => {
    unFinish.value = false
    if (isFetching.value) {
      listFinishPaperByProject(route.params.id as string)
        .then((res) => {
          finishPaperList.value = res.payload
          if (finishPaperList.value.length > 0) {
            selectedPaper.value = finishPaperList.value[0]
          }
          listPaperByProject(route.params.id as string).then((res) => {
            paperList.value = res.payload

            if (finishPaperList.value.length <= 0) {
              for (let i = 0; i < paperList.value.length; i++) {
                if (
                  paperList.value[i].status == PaperStatus.CONVERT_FINISH ||
                  paperList.value[i].status == PaperStatus.WAITING
                ) {
                  unFinish.value = true
                  break
                }
              }
              if (!unFinish.value) {
                isFetching.value = false
                MessagePlugin.error(
                  '您上传的所有论文文件均无法提取合成段，请返回重新上传',
                )
                router.push({
                  name: 'uploadPaper',
                })
              }
            } else {
              isFetching.value = false
              quickLoading.value = false
            }
          })
        })
        .finally(() => {
          paperLoading.value = false
        })
    }
  }

  onMounted(() => {
    timerId.value = setInterval(() => {
      fetchData()
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(timerId.value)
  })
  return {
    paperList,
    finishPaperList,
    selectedPaper,
    paperLoading,
    unFinish,
    quickLoading,
  }
}
