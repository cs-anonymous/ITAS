import type { Project } from '@/types/system'
import { ref } from 'vue'
import { getProjectById } from '@/apis/project'
import { useRoute, useRouter } from 'vue-router'
import { saveDownload } from '@/utils/download'
import { download } from '@/apis/file'

function useProjectInfo() {
  const route = useRoute()
  const router = useRouter()

  const project = ref<Project>()
  const projectLoading = ref(true)

  getProjectById(route.params.id as string)
    .then((res) => {
      project.value = res.payload
    })
    .catch(() => {
      router.push('/')
    })
    .finally(() => {
      projectLoading.value = false
    })

  const downloadAttachment = () => {
    if (project.value?.attachmentId) {
      download(project.value!.attachmentId).then((res) => {
        saveDownload(
          res,
          project.value?.attachmentName ||
            project.value?.attachmentId ||
            'attachment'
        )
      })
    }
  }

  return {
    project,
    projectLoading,
    downloadAttachment,
  }
}

export { useProjectInfo }
