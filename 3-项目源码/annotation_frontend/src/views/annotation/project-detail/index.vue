<template>
  <div style="background-color: #fff; border-radius: 8px">
    <div style="padding: 24px">
      <t-divider align="left" style="margin-top: 0; margin-bottom: 16px">
        <div class="title">
          <books-icon size="16px"></books-icon>
          标注项目信息
        </div>
      </t-divider>
      <t-form
        colon
        label-align="left"
        label-width="75px"
        v-loading="projectLoading"
      >
        <t-form-item label="项目名称">{{ project?.name }}</t-form-item>
        <t-form-item label="项目简介">{{ project?.introduction }}</t-form-item>
        <t-form-item label="任务书" v-if="project?.attachmentId">
          <t-link @click="downloadAttachment">
            {{ project?.attachmentName + '（点击下载）' }}
          </t-link>
        </t-form-item>
      </t-form>
      <t-divider align="left" style="margin-bottom: 16px">
        <div class="title">
          <laptop-icon size="16px"></laptop-icon>
          我的标注任务
        </div>
      </t-divider>
      <t-table
        :data="taskList"
        :columns="taskColumns"
        row-key="id"
        size="small"
        :pagination="taskPagination"
        :loading="taskLoading"
      >
        <template #finished="{ row }">
          <t-tag theme="primary" variant="light-outline" v-if="!row.finished">
            待完成
          </t-tag>
          <t-tag theme="success" variant="light-outline" v-else> 已完成 </t-tag>
        </template>
        <template #action="{ row }">
          <t-button
            theme="primary"
            variant="text"
            :href="getTaskHref(row.id)"
            tag="a"
          >
            去标注
          </t-button>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BooksIcon, LaptopIcon } from 'tdesign-icons-vue-next'
import { useProjectInfo } from './hooks/use-project-info'
import { useTaskList } from './hooks/use-task-list'
import { PrimaryTableCol } from 'tdesign-vue-next'
import { useRouter } from 'vue-router'

const { project, projectLoading, downloadAttachment } = useProjectInfo()
const { taskList, taskPagination, taskLoading } = useTaskList()

const router = useRouter()
const getTaskHref = (id: string) => {
  let to = router.resolve({
    path: '/workspace/' + id,
  })
  return to.href
}

const taskColumns: PrimaryTableCol[] = [
  {
    colKey: 'id',
    title: '任务编号',
  },
  {
    colKey: 'identifier',
    title: '文本标识符',
  },
  {
    colKey: 'userRealName',
    title: '标注人',
  },
  {
    colKey: 'createdAt',
    title: '任务创建时间',
    width: 200,
  },
  {
    colKey: 'finished',
    title: '完成情况',
    width: 150,
  },
  {
    colKey: 'action',
    width: 100,
  },
]
</script>

<style scoped lang="less">
:deep(.t-form__item) {
  margin-bottom: 8px;
}
:deep(.t-divider--with-text-left::before) {
  width: 36px;
}
:deep(.t-divider--with-text-left::before),
:deep(.t-divider--with-text::after) {
  border-top: 1px solid #dcdde1;
}
.title {
  font-weight: 500;
  color: #003cab;
}
</style>
