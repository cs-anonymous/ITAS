import { Paper } from '@/types/system'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { ref, onUnmounted, watch } from 'vue'
import { getPaperById, listPaperByProject } from '@/apis/paper'
import { listTags } from '@/apis/tag'
import { listLabelsByPaper } from '@/apis/label'
import { useAnnotationStore } from '@/stores/annotation'

function useReviewInitializer() {
  const route = useRoute()
  const router = useRouter()
  const paper = ref<Paper>()

  const annotationStore = useAnnotationStore()
  annotationStore.$reset()
  onUnmounted(() => {
    annotationStore.$reset()
  })

  getPaperById(route.params.paperId as string)
    .then((res) => {
      paper.value = res.payload
      selectedPaperId.value = res.payload.id
      listTags(paper.value.projectId).then((res) => {
        annotationStore.tagList = res.payload
      })
      listLabelsByPaper(paper.value.id).then((res) => {
        annotationStore.setPresentLabelList(res.payload)
      })
      listPaperByProject(paper.value.projectId).then((res) => {
        paperOptions.value = res.payload
      })
    })
    .catch(() => {
      router.push('/admin')
    })

  const selectedPaperId = ref<string>()
  const paperOptions = ref<Paper[]>([])
  watch(selectedPaperId, () => {
    if (selectedPaperId.value) {
      router.push('/admin/review/' + selectedPaperId.value)
    }
  })

  onBeforeRouteUpdate((to) => {
    annotationStore.$reset()
    getPaperById(to.params.paperId as string)
      .then((res) => {
        paper.value = res.payload
        selectedPaperId.value = res.payload.id
        listTags(paper.value.projectId).then((res) => {
          annotationStore.tagList = res.payload
        })
        listLabelsByPaper(paper.value.id).then((res) => {
          annotationStore.setPresentLabelList(res.payload)
        })
        listPaperByProject(paper.value.projectId).then((res) => {
          paperOptions.value = res.payload
        })
      })
      .catch(() => {
        router.push('/admin')
      })
  })

  return {
    paper,
    paperOptions,
    selectedPaperId,
  }
}

export { useReviewInitializer }
