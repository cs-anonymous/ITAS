import { Project } from '@/types/system'
import { ref } from 'vue'
import { getProjectById } from '@/apis/project'
import { useRoute } from 'vue-router'

export function useProject() {
  const project = ref<Project>()
  const loading = ref(true)
  const route = useRoute()
  getProjectById(route.params.id as string)
    .then((res) => {
      project.value = res.payload
    })
    .finally(() => {
      loading.value = false
    })
  return {
    loading,
    project,
  }
}
