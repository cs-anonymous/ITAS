import { ref, reactive, computed } from 'vue'
import { createProject } from '@/apis/project.ts'
import { useRouter } from 'vue-router'

interface ProjectForm {
  name: string
  introduction: string
}

export function useCreateProject() {
  const router = useRouter()
  const createLoading = ref(false)
  const projectForm = reactive<ProjectForm>({
    name: '',
    introduction: '',
  })
  const shouldCreate = computed(
    () => projectForm.name && projectForm.introduction,
  )
  const onCreateProject = () => {
    createLoading.value = true
    createProject(projectForm)
      .then((res) => {
        if (res.payload.id) {
          router.push('/project/' + res.payload.id)
        }
        projectForm.name = ''
        projectForm.introduction = ''
      })
      .finally(() => {
        createLoading.value = false
      })
  }
  return {
    shouldCreate,
    createLoading,
    projectForm,
    onCreateProject,
  }
}
