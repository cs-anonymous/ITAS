<template>
  <div>
    <t-button theme="primary" class="add-item-btn" @click="showCreateModal">
      <template #icon><add-icon /></template>
      新建标注项目
    </t-button>
    <t-dialog
      v-model:visible="createModalVisible"
      header="新建标注项目"
      width="60%"
      @confirm="onModalConfrim"
    >
      <project-info-form ref="createProjectFormRef"></project-info-form>
    </t-dialog>
    <div class="data-list" v-loading="projectLoading">
      <div
        v-for="p in projectList"
        :key="p.id"
        :project="p"
        class="data-list-item"
      >
        <router-link
          :to="'/admin/project/' + p.id"
          custom
          v-slot="{ navigate }"
        >
          <t-card :bordered="false" hover-shadow @click="navigate">
            <template #title>
              {{ p.name }}
              <t-tag
                v-if="!p.assigned"
                style="margin-left: 4px; vertical-align: text-bottom"
                variant="light-outline"
                theme="primary"
                size="small"
              >
                待配置
              </t-tag>
              <t-tag
                v-else
                style="margin-left: 4px; vertical-align: text-bottom"
                variant="light-outline"
                theme="success"
                size="small"
              >
                已分配
              </t-tag>
            </template>
            <template #subtitle>
              <span v-if="!p.assigned">创建于 {{ p.createdAt }}</span>
              <span v-else>分配于 {{ p.assignedAt }}</span>
            </template>
            {{ p.introduction }}
          </t-card>
        </router-link>
      </div>
    </div>
    <t-pagination
      class="pagination"
      showFirstAndLastPageBtn
      v-model="pagination.pageNum"
      v-model:pageSize="pagination.pageSize"
      :total="pagination.total"
    ></t-pagination>
  </div>
</template>

<script setup lang="ts">
import { AddIcon } from 'tdesign-icons-vue-next'
import { ref } from 'vue'
import ProjectInfoForm from '@/components/ProjectInfoForm.vue'
import { useProjectList } from './hooks/use-project-list'
import { useCreateProject } from './hooks/use-create-project'

const createProjectFormRef = ref()

const { projectList, projectLoading, pagination, getProjectList } =
  useProjectList()

const { createModalVisible, showCreateModal, onModalConfrim } =
  useCreateProject(createProjectFormRef, getProjectList)
</script>

<style scoped lang="less">
.data-list {
  :deep(.t-card__header) {
    padding-bottom: 0;
  }
  .data-list-item {
    margin-top: 24px;
  }
}
.pagination {
  margin-top: 24px;
}
</style>
