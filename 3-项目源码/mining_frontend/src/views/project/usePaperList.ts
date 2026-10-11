import { reactive, ref } from 'vue'
import {
  listFinishPaperByProject,
  listPaperByProject,
  pagePaper,
} from '@/apis/paper'
import type { Paper } from '@/types/system'
import { useRoute } from 'vue-router'
import { PaperStatus } from '@/types/enum.ts'

export function usePaperList() {
  const paperList = ref<Paper[]>([])
  const pagination = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  })
  const route = useRoute()
  const loading = ref(false)
  const getPaperList = () => {
    loading.value = true
    pagePaper({
      projectId: route.params.id as string,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    })
      .then((res) => {
        paperList.value = res.payload.records
        pagination.total = res.payload.total
      })
      .finally(() => {
        loading.value = false
      })
  }
  const hasParagraphFinish = ref(false)
  const finishPaperList = ref<Paper[]>([])

  listFinishPaperByProject(route.params.id as string).then((res) => {
    finishPaperList.value = res.payload
    if (finishPaperList.value.length > 0) {
      hasParagraphFinish.value = true
    }
  })

  return {
    paperList,
    pagination,
    loading,
    getPaperList,
    hasParagraphFinish,
  }
}
