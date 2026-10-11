import { Ref } from 'vue'
import { updateProject } from '@/apis/project'
import type { FormData } from '@/components/ProjectInfoForm.vue'
import { MessagePlugin } from 'tdesign-vue-next'

function useUpdateProject(
  updateProjectFormRef: Ref,
  projectId: string,
  afterUpdateCallback: Function
) {
  const onUpdateInfoBtnClick = () => {
    updateProjectFormRef.value.validate().then((res: FormData) => {
      updateProject(projectId, res).then(() => {
        MessagePlugin.success('修改成功')
        afterUpdateCallback()
      })
    })
  }

  return {
    onUpdateInfoBtnClick,
  }
}

export { useUpdateProject }
