<template>
  <div v-loading="loading">
    <div class="data-list">
      <div
        v-for="p in projectList"
        :key="p.id"
        :project="p"
        class="data-list-item"
      >
        <router-link :to="'/project/' + p.id" custom v-slot="{ navigate }">
          <t-card :bordered="false" hover-shadow @click="navigate">
            <template #title>
              {{ p.name }}
            </template>
            <template #subtitle>
              <span>任务分配于 {{ p.assignedAt }}</span>
            </template>
            {{ p.introduction }}
          </t-card>
        </router-link>
      </div>
    </div>
    <t-pagination
      class="pagination"
      showFirstAndLastPageBtn
      v-model="pagination.current"
      v-model:pageSize="pagination.pageSize"
      :total="pagination.total"
    ></t-pagination>
  </div>
</template>

<script setup lang="ts">
import { useProjectList } from './hooks/use-project-list'

const { projectList, pagination, loading } = useProjectList()
</script>

<style scoped lang="less">
.data-list {
  :deep(.t-card__header) {
    padding-bottom: 0;
  }
  .data-list-item {
    &:not(:first-child) {
      margin-top: 24px;
    }
  }
}
.pagination {
  margin-top: 24px;
}
</style>
