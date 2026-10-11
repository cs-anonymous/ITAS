<template>
  <t-space style="margin-bottom: 24px" v-if="!props.assigned">
    <t-button @click="showAddPaperModal">
      <template #icon><add-icon></add-icon></template>
      加入新的标注文本
    </t-button>
    <t-button
      theme="danger"
      :disabled="paperSelectedRowKeys.length == 0"
      @click="deleteSelectedPaper"
    >
      <template #icon><delete-icon></delete-icon></template>
      移除所选标注文本
    </t-button>
    <t-button @click="onCheckIdentifier" theme="default">
      <template #icon><check-icon></check-icon></template>
      检查文本标识符唯一性
    </t-button>
  </t-space>
  <t-dialog
    v-model:visible="addPaperModalVisible"
    width="80%"
    header="加入标注文本"
    :footer="false"
  >
    <t-upload
      v-model:files="files"
      placeholder="上传pdf格式的标注文本，单次上传文件总大小不超过100MB，如标注文本数量较多建议分为多次上传。"
      theme="file-flow"
      multiple
      accept=".pdf"
      :auto-upload="false"
      :upload-all-files-in-one-request="true"
      :request-method="uploadPapers"
      :before-all-files-upload="beforeAllFilesUpload"
    >
    </t-upload>
  </t-dialog>
  <t-table
    :columns="props.assigned ? columns.slice(1) : columns"
    :data="paperList"
    v-model:pagination="pagination"
    size="small"
    row-key="id"
    resizable
    v-model:selected-row-keys="paperSelectedRowKeys"
    :filter-row="() => null"
    @filter-change="onFilterChange"
    @sort-change="onSortChange"
  >
    <template #title-status>
      文本转换状态
      <t-button variant="text" @click="getPaperList" shape="circle">
        <template #icon> <refresh-icon size="14px"></refresh-icon></template>
      </t-button>
    </template>
    <template #status="{ row }">
      <t-tag
        shape="round"
        theme="primary"
        v-if="row.status === 0"
        variant="light-outline"
      >
        <round-icon></round-icon>
        转换中
      </t-tag>
      <t-tag
        shape="round"
        theme="danger"
        v-if="row.status === -1"
        variant="light-outline"
      >
        <close-circle-filled-icon></close-circle-filled-icon>
        转换失败
      </t-tag>
      <t-tag
        shape="round"
        theme="success"
        v-if="row.status === 1"
        variant="light-outline"
      >
        <check-circle-filled-icon></check-circle-filled-icon>
        转换完成
      </t-tag>
    </template>
    <template #filename="{ row }">
      {{ row.filename }}
      <t-link
        theme="primary"
        style="margin-left: 4px"
        @click="downloadPdf(row.pdfId, row.filename)"
        >下载</t-link
      >
    </template>
  </t-table>
</template>

<script setup lang="ts">
import {
  UploadFile,
  RequestMethodResponse,
  PrimaryTableCol,
  PageInfo,
  MessagePlugin,
  TableRowData,
  Input,
  PrimaryTableOnEditedContext,
  FilterValue,
  TableSort,
  SortInfo,
  DialogPlugin,
} from 'tdesign-vue-next'
import {
  uploadPaper,
  pagePaper,
  updateIdentifier,
  removePaper,
  checkIdentifier,
} from '@/apis/paper'
import { download } from '@/apis/file'
import { saveDownload } from '@/utils/download'
import { ref, reactive, watchEffect } from 'vue'
import type { Paper } from '@/types/system'
import {
  AddIcon,
  DeleteIcon,
  RoundIcon,
  CheckCircleFilledIcon,
  CloseCircleFilledIcon,
  CheckIcon,
  RefreshIcon,
} from 'tdesign-icons-vue-next'

interface Props {
  projectId: string
  assigned?: boolean
}

const props = withDefaults(defineProps<Props>(), { assigned: true })

const addPaperModalVisible = ref(false)
const showAddPaperModal = () => {
  addPaperModalVisible.value = true
}

const files = ref<UploadFile[]>([])
const uploadPapers = (
  fs: UploadFile | UploadFile[]
): Promise<RequestMethodResponse> => {
  return new Promise((resolve, reject) => {
    uploadPaper(props.projectId, fs as UploadFile[])
      .then(() => {
        pagination.current = 1
        getPaperList()
        files.value = []
        MessagePlugin.success('上传成功，可在标注文本列表中查看转换进度')
        resolve({
          status: 'success',
          response: {
            url: 'unknown',
          },
        })
      })
      .catch((err) => {
        reject({
          status: 'fail',
          response: err,
        })
      })
  })
}
const beforeAllFilesUpload = (fs: UploadFile[]) => {
  let size = 0
  fs.forEach((f) => {
    size += f.size || 0
  })
  if (size >= 104857600) {
    MessagePlugin.warning(
      '单次上传文件总大小不应超过100MB，请您重新选择，如有需要可分为多次上传'
    )
    return false
  }
  return true
}

const paperList = ref<Paper[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (pageInfo: PageInfo) => {
    pagination.current = pageInfo.current
    pagination.pageSize = pageInfo.pageSize
  },
})
const columns: PrimaryTableCol[] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    colKey: 'identifier',
    title: '文本标识符（应确保项目内唯一）',
    edit: props.assigned
      ? undefined
      : {
          component: Input,
          props: {
            clearable: true,
          },
          onEdited: (context: PrimaryTableOnEditedContext<TableRowData>) => {
            updateIdentifier({
              id: context.newRowData.id,
              identifier: context.newRowData.identifier,
            }).then((res) => {
              if (res.payload) {
                MessagePlugin.success('修改成功')
                getPaperList()
              } else {
                MessagePlugin.error('修改失败，请刷新后重试')
              }
            })
          },
          rules: [{ required: true, message: '标识符不能为空' }],
          abortEditOnEvent: ['onEnter'],
        },
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: { placeholder: '按文本标识符搜索' },
      showConfirmAndReset: true,
    },
    sortType: 'all',
    sorter: true,
  },
  {
    colKey: 'status',
    title: 'title-status',
    width: 200,
    filter: {
      type: 'single',
      list: [
        { label: '转换中', value: 0 },
        { label: '转换完成', value: 1 },
        { label: '转换失败', value: -1 },
      ],
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'filename',
    title: '文件名',
  },
  {
    colKey: 'createdAt',
    title: '上传时间',
    width: 200,
    sortType: 'all',
    sorter: true,
  },
]
const filterValue = reactive({
  identifier: undefined,
  status: undefined,
})
const onFilterChange = (filters: FilterValue) => {
  filterValue.identifier = filters.identifier || undefined
  filterValue.status = filters.status ?? undefined
}
const sortValue = reactive({
  sortBy: '',
  descending: false,
})
const onSortChange = (val: TableSort) => {
  sortValue.sortBy = (val as SortInfo)?.sortBy || ''
  sortValue.descending = (val as SortInfo)?.descending || false
}

const getPaperList = () => {
  pagePaper({
    projectId: props.projectId,
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    identifier: filterValue.identifier,
    status: filterValue.status,
    sortField: sortValue.sortBy,
    sortDescending: sortValue.descending,
  }).then((res) => {
    paperList.value = res.payload.records
    pagination.total = res.payload.total
  })
}
watchEffect(getPaperList)

const paperSelectedRowKeys = ref<string[]>([])
const deleteSelectedPaper = () => {
  if (paperSelectedRowKeys.value.length > 0) {
    removePaper(paperSelectedRowKeys.value).then((res) => {
      if (res.payload) {
        MessagePlugin.success('移除成功')
        pagination.current = 1
        getPaperList()
        paperSelectedRowKeys.value = []
      }
    })
  }
}

const onCheckIdentifier = () => {
  checkIdentifier(props.projectId).then((res) => {
    if (res.payload.length > 0) {
      const dialog = DialogPlugin({
        header: '该项目中有以下文本标识符重复，请检查修改：',
        body: res.payload.join('  ,  '),
        footer: false,
        theme: 'warning',
        onConfirm() {
          dialog.hide()
        },
      })
    } else {
      const dialog = DialogPlugin({
        header: '该项目中没有文本标识符重复',
        body: '该项目中所有文本标识符唯一，可进行后续任务分配。',
        footer: false,
        theme: 'success',
        onConfirm() {
          dialog.hide()
        },
      })
    }
  })
}

const downloadPdf = (id: string, filename: string) => {
  download(id).then((res) => {
    saveDownload(res, filename)
  })
}
</script>

<style scoped lang="less">
:deep(.t-upload__flow) {
  max-width: 100%;
}
</style>
