import type { Task } from '@/types/system'
import { ref, reactive } from 'vue'
import { pageMyTask } from '@/apis/task'
import { useRoute } from 'vue-router'
import { PageInfo } from 'tdesign-vue-next'

function useTaskList() {
  const route = useRoute()

  const taskLoading = ref(false)
  const taskList = ref<Task[]>([])
  const taskPagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: (pageInfo: PageInfo) => {
      taskPagination.current = pageInfo.current
      taskPagination.pageSize = pageInfo.pageSize
      sessionStorage.setItem(
        ('annotation-project-' + route.params.id) as string,
        JSON.stringify({
          current: taskPagination.current,
          pageSize: taskPagination.pageSize,
        })
      )
      getTaskList()
    },
  })
  const pa = sessionStorage.getItem(
    ('annotation-project-' + route.params.id) as string
  )
  if (pa) {
    try {
      taskPagination.current = JSON.parse(pa).current
      taskPagination.pageSize = JSON.parse(pa).pageSize
    } catch {
      sessionStorage.removeItem(
        ('annotation-project-' + route.params.id) as string
      )
    }
  }
  const getTaskList = () => {
    taskLoading.value = true
    pageMyTask({
      projectId: route.params.id as string,
      pageNum: taskPagination.current,
      pageSize: taskPagination.pageSize,
    })
      .then((res) => {
        taskPagination.total = res.payload.total
        taskList.value = res.payload.records
      })
      .finally(() => {
        taskLoading.value = false
      })
  }
  getTaskList()

  return {
    taskList,
    taskPagination,
    taskLoading,
  }
}

export { useTaskList }
