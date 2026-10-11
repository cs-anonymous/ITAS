<template>
  <t-space style="margin-bottom: 24px" v-if="!props.assigned">
    <t-button theme="primary" @click="showAddAnnotatorModal">
      <template #icon><add-icon /></template>
      加入新的标注人员
    </t-button>
    <t-button
      theme="danger"
      :disabled="annotatorSelectedRowKeys.length == 0"
      @click="deleteSelectedAnnotator"
    >
      <template #icon><delete-icon></delete-icon></template>
      移除所选标注人员
    </t-button>
  </t-space>
  <t-dialog
    v-model:visible="addAnnotatorModalVisible"
    header="选择标注人员"
    width="80%"
    :on-confirm="addSelectedAnnotator"
  >
    <t-table
      :data="userList"
      row-key="id"
      :columns="userColumns"
      :pagination="userPagination"
      v-model:selected-row-keys="userSelectedRowKeys"
      size="small"
    >
    </t-table>
  </t-dialog>
  <t-table
    :data="annotatorList"
    row-key="id"
    :columns="props.assigned ? annotatorColumns.slice(1) : annotatorColumns"
    :pagination="annotatorPagination"
    v-model:selected-row-keys="annotatorSelectedRowKeys"
    size="small"
  >
  </t-table>
</template>

<script setup lang="ts">
import { pageUser } from '@/apis/user'
import { User } from '@/types/system'
import { ref, reactive, watchEffect } from 'vue'
import {
  PrimaryTableCol,
  PageInfo,
  TableRowData,
  MessagePlugin,
} from 'tdesign-vue-next'
import {
  addAnnotator,
  removeAnnotator,
  pageAnnotator,
  getAllAnnotatorIds,
} from '@/apis/annotator'
import { AddIcon, DeleteIcon } from 'tdesign-icons-vue-next'

interface Props {
  projectId: string
  assigned?: boolean
}

const props = withDefaults(defineProps<Props>(), { assigned: true })

const addAnnotatorModalVisible = ref(false)
const showAddAnnotatorModal = () => {
  addAnnotatorModalVisible.value = true
}

// 当前项目已有的标注人员Id列表
const annotatorIds = ref<string[]>([])
getAllAnnotatorIds(props.projectId).then((res) => {
  annotatorIds.value = res.payload
})

// 标注人员表格
const annotatorList = ref<User[]>([])
const annotatorPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (pageInfo: PageInfo) => {
    annotatorPagination.current = pageInfo.current
    annotatorPagination.pageSize = pageInfo.pageSize
  },
})
const getAnnotatorList = () => {
  pageAnnotator({
    projectId: props.projectId,
    pageNum: annotatorPagination.current,
    pageSize: annotatorPagination.pageSize,
  }).then((res) => {
    annotatorList.value = res.payload.records
    annotatorPagination.total = res.payload.total
  })
}
watchEffect(getAnnotatorList)
const annotatorColumns: PrimaryTableCol[] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    colKey: 'username',
    title: '用户名',
  },
  {
    colKey: 'realName',
    title: '姓名',
  },
  {
    colKey: 'createdAt',
    title: '注册时间',
  },
]
const annotatorSelectedRowKeys = ref<string[]>([])

// 系统用户表格
const userList = ref<User[]>([])
const userPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (pageInfo: PageInfo) => {
    userPagination.current = pageInfo.current
    userPagination.pageSize = pageInfo.pageSize
  },
})
const getUserList = () => {
  pageUser({
    pageNum: userPagination.current,
    pageSize: userPagination.pageSize,
  }).then((res) => {
    userList.value = res.payload.records
    userPagination.total = res.payload.total
  })
}
watchEffect(getUserList)
const userColumns: PrimaryTableCol[] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
    disabled: (options: { row: TableRowData }) =>
      annotatorIds.value.findIndex((a) => a == options.row.id) >= 0,
  },
  {
    colKey: 'username',
    title: '用户名',
  },
  {
    colKey: 'realName',
    title: '姓名',
  },
  {
    colKey: 'createdAt',
    title: '注册时间',
  },
]
const userSelectedRowKeys = ref<string[]>([])

// 添加标注用户
const addSelectedAnnotator = () => {
  if (userSelectedRowKeys.value.length > 0) {
    addAnnotator(props.projectId, userSelectedRowKeys.value).then((res) => {
      annotatorIds.value = res.payload
      MessagePlugin.success('添加成功')
      userSelectedRowKeys.value = []
      annotatorPagination.current = 1
      getAnnotatorList()
      addAnnotatorModalVisible.value = false
    })
  }
}

// 移除标注用户
const deleteSelectedAnnotator = () => {
  if (annotatorSelectedRowKeys.value.length > 0) {
    removeAnnotator(props.projectId, annotatorSelectedRowKeys.value).then(
      (res) => {
        annotatorIds.value = res.payload
        MessagePlugin.success('移除成功')
        annotatorPagination.current = 1
        getAnnotatorList()
        annotatorSelectedRowKeys.value = []
      }
    )
  }
}
</script>

<style scoped></style>
