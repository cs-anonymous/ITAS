import { ref, Ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormData } from '@/components/ProjectInfoForm.vue'
import { createProject } from '@/apis/project'

function useCreateProject(
  createProjectFormRef: Ref,
  afterCreateCallback: Function
) {
  const createModalVisible = ref(false)
  const showCreateModal = () => {
    createModalVisible.value = true
  }
  const onModalConfrim = () => {
    createProjectFormRef.value.validate().then((res: FormData) => {
      createProject(res).then(() => {
        createProjectFormRef.value.reset()
        MessagePlugin.success('创建成功')
        afterCreateCallback()
        createModalVisible.value = false
      })
    })
  }
  return {
    createModalVisible,
    showCreateModal,
    onModalConfrim,
  }
}

export { useCreateProject }
