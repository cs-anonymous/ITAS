import { pageAllProject } from '@/apis/project'
import { Project } from '@/types/system'
import { ref, reactive, watchEffect } from 'vue'

export function useProjectList() {
  const projectList = ref<Project[]>([])
  const loading = ref(false)
  const pagination = reactive({
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
  })
  watchEffect(() => {
    loading.value = true
    pageAllProject({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    })
      .then((res) => {
        projectList.value = res.payload.records
        pagination.totalPage = res.payload.totalPage
      })
      .finally(() => {
        loading.value = false
      })
  })
  return {
    projectList,
    loading,
    pagination,
  }
}
