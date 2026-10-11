import { Project } from '@/types/system'
import { ref, reactive, watchEffect } from 'vue'
import { pageMyProject } from '@/apis/project'

function useProjectList() {
  const projectList = ref<Project[]>()
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const loading = ref(false)
  const getProjectList = () => {
    loading.value = true
    pageMyProject({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    })
      .then((res) => {
        pagination.total = res.payload.total
        projectList.value = res.payload.records
      })
      .finally(() => {
        loading.value = false
      })
  }
  watchEffect(getProjectList)
  return {
    projectList,
    pagination,
    loading,
  }
}

export { useProjectList }
