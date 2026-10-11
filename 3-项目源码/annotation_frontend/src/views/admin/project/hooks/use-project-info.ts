import { ref } from 'vue'
import type { Project } from '@/types/system'
import { useRoute, useRouter } from 'vue-router'
import { getProjectById } from '@/apis/project'
import { MessagePlugin } from 'tdesign-vue-next'

function useProjectInfo() {
  const project = ref<Project>()
  const projectLoading = ref(false)

  const route = useRoute()
  const router = useRouter()

  const projectId = route.params.id as string

  const getProjectInfo = () => {
    projectLoading.value = true
    getProjectById(projectId)
      .then((res) => {
        project.value = res.payload
      })
      .catch(() => {
        MessagePlugin.error('标注项目不存在')
        router.push('/admin')
      })
      .finally(() => {
        projectLoading.value = false
      })
  }
  getProjectInfo()

  return {
    project,
    projectId,
    getProjectInfo,
    projectLoading,
  }
}

export { useProjectInfo }
