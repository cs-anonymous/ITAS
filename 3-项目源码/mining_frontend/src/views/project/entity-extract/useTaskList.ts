import { Task } from '@/types/system'
import { ref } from 'vue'
import { listTaskByProject, getTaskById } from '@/apis/task'
import { useRoute } from 'vue-router'

export function useTaskList() {
  const taskList = ref<Task[]>()
  const taskLoading = ref(false)
  const currentTask = ref<Task>()
  const curTask = ref<Task>()
  const route = useRoute()
  const getTaskList = () => {
    listTaskByProject(route.params.id as string)
      .then((res) => {
        taskList.value = res.payload
        if (taskList.value.length > 0 && !currentTask.value) {
          currentTask.value = taskList.value[0]
        }
      })
      .finally(() => {
        taskLoading.value = false
      })
  }
  const getTask = () => {
    if (!(route.params.taskId == null)) {
      getTaskById(route.params.taskId as string).then((res) => {
        curTask.value = res.payload
      })
    }
  }
  getTaskList()
  getTask()
  return {
    taskList,
    taskLoading,
    currentTask,
    getTaskList,
    getTask,
    curTask,
  }
}
