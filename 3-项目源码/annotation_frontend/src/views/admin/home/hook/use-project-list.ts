import type { Project } from '@/types/system'
import { pageAllProject } from '@/apis/project'
import { ref, reactive, watchEffect } from 'vue'

function useProjectList() {
  const projectList = ref<Project[]>([])
  const projectLoading = ref(false)
  const pagination = reactive({
    total: 0,
    pageNum: 1,
    pageSize: 10,
  })
  const getProjectList = () => {
    projectLoading.value = true
    pageAllProject({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    })
      .then((res) => {
        projectList.value = res.payload.records
        pagination.total = res.payload.total
      })
      .finally(() => {
        projectLoading.value = false
      })
  }
  watchEffect(getProjectList)

  return {
    projectList,
    projectLoading,
    pagination,
    getProjectList,
  }
}

export { useProjectList }
