<template>
  <t-row :gutter="24">
    <t-col :span="2">
      <t-card>
        <span class="description">标注人员</span>
        <span class="number">{{ statistic.annotatorCount }}</span>
      </t-card>
    </t-col>
    <t-col :span="2">
      <t-card>
        <span class="description">标注文本</span>
        <span class="number">{{ statistic.paperCount }}</span>
      </t-card>
    </t-col>
    <t-col :span="2">
      <t-card>
        <span class="description">标注标签</span>
        <span class="number">{{ statistic.tagCount }}</span>
      </t-card>
    </t-col>
    <t-col :span="4">
      <t-card>
        <span class="description">标注任务 (已完成/全部)</span>
        <span class="number">
          {{ statistic.finishTaskCount }} / {{ statistic.taskCount }}
        </span>
      </t-card>
    </t-col>
    <t-col :span="2">
      <t-button
        block
        style="height: 54px"
        theme="primary"
        size="large"
        @click="onExportResult"
        :loading="exportLoading"
      >
        <template #icon><cloud-download-icon></cloud-download-icon></template>
        导出数据
      </t-button>
    </t-col>
  </t-row>
  <t-table
    :data="taskList"
    :columns="columns"
    size="small"
    row-key="id"
    resizable
    style="margin-top: 24px"
    :pagination="pagination"
  >
    <template #finished="{ row }">
      <t-tag theme="primary" variant="light-outline" v-if="!row.finished">
        待完成
      </t-tag>
      <t-tag theme="success" variant="light-outline" v-else> 已完成 </t-tag>
    </template>
    <template #action="{ row }">
      <router-link
        :to="'/admin/review/' + row.paperId"
        custom
        v-slot="{ navigate }"
      >
        <t-button theme="primary" variant="text" @click="navigate">
          查看标注
        </t-button>
      </router-link>
    </template>
  </t-table>
</template>

<script setup lang="ts">
import { PrimaryTableCol, PageInfo, MessagePlugin } from 'tdesign-vue-next'
import { ref, reactive, watchEffect } from 'vue'
import type { Task } from '@/types/system'
import { pageAllTask, getStatistic } from '@/apis/task'
import { CloudDownloadIcon } from 'tdesign-icons-vue-next'
import { exportResult } from '@/apis/project'
import { saveDownload } from '@/utils/download'
import { tagKeyUnique } from '@/apis/tag'

interface Props {
  projectId: string
}

const props = defineProps<Props>()

const columns: PrimaryTableCol[] = [
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
    colKey: 'finished',
    title: '完成情况',
    width: 120,
  },
  {
    colKey: 'createdAt',
    title: '任务创建时间',
    width: 200,
  },
  {
    colKey: 'action',
    width: 100,
  },
]

const taskList = ref<Task[]>()
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (pageInfo: PageInfo) => {
    pagination.current = pageInfo.current
    pagination.pageSize = pageInfo.pageSize
  },
})
const getTaskList = () => {
  pageAllTask({
    projectId: props.projectId,
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
  }).then((res) => {
    pagination.total = res.payload.total
    taskList.value = res.payload.records
  })
}
watchEffect(getTaskList)

const statistic = reactive({
  annotatorCount: 0,
  paperCount: 0,
  tagCount: 0,
  taskCount: 0,
  finishTaskCount: 0,
})
getStatistic(props.projectId).then((res) => {
  statistic.annotatorCount = res.payload.annotatorCount
  statistic.paperCount = res.payload.paperCount
  statistic.tagCount = res.payload.tagCount
  statistic.taskCount = res.payload.taskCount
  statistic.finishTaskCount = res.payload.finishedTaskCount
})

const exportLoading = ref(false)
const onExportResult = () => {
  exportLoading.value = true
  tagKeyUnique(props.projectId)
    .then((res) => {
      if (res.payload) {
        exportResult(props.projectId)
          .then((res) => {
            MessagePlugin.success('导出成功')
            saveDownload(res, props.projectId + '.json')
          })
          .catch(() => {
            MessagePlugin.error('导出失败')
          })
          .finally(() => {
            exportLoading.value = false
          })
      } else {
        MessagePlugin.error('当前项目中标签KEY值不唯一，请修改后再导出数据')
        exportLoading.value = false
      }
    })
    .catch(() => {
      exportLoading.value = false
    })
}
</script>

<style scoped>
.description {
  font-weight: 700;
  color: #999;
}
.number {
  margin-left: 20px;
  vertical-align: top;
  font-weight: 700;
  font-size: 24px;
  color: #333;
}
</style>
