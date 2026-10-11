<template>
  <div style="background-color: #fff; border-radius: 8px">
    <div style="padding: 12px 24px 24px 24px">
      <t-tabs default-value="info">
        <t-tab-panel value="info" label="基本信息">
          <div
            class="tab-content"
            style="width: 60%; margin: 0 auto"
            v-loading="projectLoading"
          >
            <project-info-form
              ref="updateProjectFormRef"
              :init="project"
            ></project-info-form>
            <t-button
              block
              theme="primary"
              variant="base"
              @click="onUpdateInfoBtnClick"
              class="save-info-btn"
            >
              保存信息
            </t-button>
          </div>
        </t-tab-panel>
        <t-tab-panel value="annotator" label="标注人员">
          <div class="tab-content">
            <annotator-selector
              :assigned="project?.assigned"
              :project-id="projectId"
            ></annotator-selector>
          </div>
        </t-tab-panel>
        <t-tab-panel value="paper" label="标注文本">
          <div class="tab-content">
            <paper-selector
              :assigned="project?.assigned"
              :project-id="projectId"
            ></paper-selector>
          </div>
        </t-tab-panel>
        <t-tab-panel value="tag" label="标注标签">
          <div class="tab-content">
            <tag-selector
              :assigned="project?.assigned"
              :project-id="projectId"
            ></tag-selector>
          </div>
        </t-tab-panel>
        <t-tab-panel
          value="task"
          :label="project?.assigned ? '任务列表' : '任务分配'"
        >
          <div class="tab-content">
            <task-assign
              v-if="!project?.assigned"
              :project-id="projectId"
              @refresh="getProjectInfo"
            ></task-assign>
            <task-table v-else :project-id="projectId"></task-table>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectInfoForm from '@/components/ProjectInfoForm.vue'
import AnnotatorSelector from './comp/AnnotatorSelector.vue'
import PaperSelector from './comp/PaperSelector.vue'
import TagSelector from './comp/TagSelector.vue'
import TaskAssign from './comp/TaskAssign.vue'
import TaskTable from './comp/TaskTable.vue'
import { useProjectInfo } from './hooks/use-project-info'
import { useUpdateProject } from './hooks/use-update-project'

const { project, projectId, getProjectInfo, projectLoading } = useProjectInfo()

const updateProjectFormRef = ref()
const { onUpdateInfoBtnClick } = useUpdateProject(
  updateProjectFormRef,
  projectId,
  getProjectInfo
)
</script>

<style scoped lang="less">
.tab-content {
  padding-top: 24px;
  min-width: 560px;
}
:deep(.t-tabs__nav-wrap) {
  margin: 0 auto;
}
.save-info-btn {
  margin-top: 24px;
  margin-left: 90px;
  width: calc(100% - 90px);
}
</style>
