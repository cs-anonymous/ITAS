import { ref, onUnmounted, computed } from 'vue'
import type { Task } from '@/types/system'
import { useRoute, useRouter } from 'vue-router'
import { useAnnotationStore } from '@/stores/annotation'
import { getTaskById, changeFinished } from '@/apis/task'
import { listTags } from '@/apis/tag'
import { listLabelsByTask } from '@/apis/label'
import { MessagePlugin } from 'tdesign-vue-next'

function useAnnotationInitializer() {
  const task = ref<Task>()
  const route = useRoute()
  const router = useRouter()

  const annotationStore = useAnnotationStore()
  annotationStore.$reset()
  onUnmounted(() => {
    annotationStore.$reset()
  })

  const taskLoading = ref(true)
  getTaskById(route.params.id as string)
    .then((res) => {
      if (res.payload) {
        task.value = res.payload
        annotationStore.taskId = task.value.id
        listTags(task.value.projectId).then((res) => {
          annotationStore.tagList = res.payload
        })
        listLabelsByTask(task.value.id).then((res) => {
          annotationStore.setPresentLabelList(res.payload)
        })
      } else {
        MessagePlugin.error('标注任务不存在')
        router.push('/')
      }
    })
    .finally(() => {
      taskLoading.value = false
    })

  const changeTaskFinished = () => {
    taskLoading.value = true
    changeFinished(route.params.id as string)
      .then((res) => {
        if (res.payload) {
          getTaskById(route.params.id as string)
            .then((res) => {
              task.value = res.payload
            })
            .finally(() => {
              taskLoading.value = false
            })
        } else {
          taskLoading.value = false
        }
      })
      .catch(() => {
        taskLoading.value = false
      })
  }

  const taskFinished = computed(() => (task.value?.finished ? true : false))

  return { changeTaskFinished, task, taskFinished, taskLoading }
}

export { useAnnotationInitializer }
