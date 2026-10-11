<template>
  <t-space style="margin-bottom: 24px" v-if="!props.assigned">
    <t-button theme="primary" @click="showAddTagDialog">
      <template #icon><add-icon></add-icon></template>
      创建新的标签
    </t-button>
    <t-button
      theme="danger"
      @click="onClickRemoveTags"
      :disabled="selectedTagIds.length == 0"
    >
      <template #icon><delete-icon></delete-icon></template>
      删除所选标签
    </t-button>
  </t-space>
  <t-dialog
    v-model:visible="addTagDialogVisible"
    header="新建标签"
    width="50%"
    @confirm="submitForm"
  >
    <t-form :data="tagFormData" :rules="tagFormRules" ref="tagFormRef">
      <t-form-item
        name="tagKey"
        label="标签KEY"
        help="标签KEY用于数据导出时区分标签类别，建议使用英文命名。"
      >
        <t-input v-model="tagFormData.tagKey" placeholder=""></t-input>
      </t-form-item>
      <t-form-item
        name="tagName"
        label="标签名称"
        help="标签名称将在页面展示给标注人员选择。"
      >
        <t-input v-model="tagFormData.tagName" placeholder=""></t-input>
      </t-form-item>
    </t-form>
  </t-dialog>
  <t-table
    :data="tagList"
    :columns="props.assigned ? columns.slice(1) : columns"
    size="small"
    v-model:selected-row-keys="selectedTagIds"
    row-key="id"
    :pagination="pagination"
  >
  </t-table>
</template>

<script setup lang="ts">
import { AddIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import {
  FormValidateResult,
  Input,
  MessagePlugin,
  PrimaryTableCol,
  PrimaryTableOnEditedContext,
  TableRowData,
} from 'tdesign-vue-next'
import { ref, reactive } from 'vue'
import { createTag, listTags, removeTags, updateTag } from '@/apis/tag'
import type { Tag } from '@/types/system'

interface Props {
  projectId: string
  assigned?: boolean
}

const props = withDefaults(defineProps<Props>(), { assigned: true })

const addTagDialogVisible = ref(false)
const showAddTagDialog = () => {
  addTagDialogVisible.value = true
}

interface FormData {
  tagKey: string
  tagName: string
}
const tagFormData = reactive<FormData>({
  tagKey: '',
  tagName: '',
})
const tagFormRules = {
  tagKey: [{ required: true, message: '请输入标签KEY' }],
  tagName: [{ required: true, message: '请输入标签名称' }],
}
const tagFormRef = ref()
const submitForm = () => {
  tagFormRef.value.validate().then((result: FormValidateResult<FormData>) => {
    if (result === true) {
      createTag(props.projectId, tagFormData).then((res) => {
        if (res) {
          MessagePlugin.success('创建成功')
          getTagList()
          addTagDialogVisible.value = false
          tagFormRef.value.reset()
        }
      })
    }
  })
}

const tagList = ref<Tag[]>([])
const getTagList = () => {
  listTags(props.projectId).then((res) => {
    tagList.value = res.payload
    pagination.total = res.payload.length
  })
}
getTagList()

const columns: PrimaryTableCol[] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    colKey: 'tagKey',
    title: '标签KEY',
    edit: {
      component: Input,
      props: { clearable: true },
      rules: [{ required: true, message: '请输入标签KEY' }],
      onEdited: (context: PrimaryTableOnEditedContext<TableRowData>) => {
        updateTag(context.newRowData.id, {
          tagKey: context.newRowData.tagKey,
          tagName: context.newRowData.tagName,
        }).then(() => {
          MessagePlugin.success('修改成功')
          getTagList()
        })
      },
      abortEditOnEvent: ['onEnter'],
    },
  },
  {
    colKey: 'tagName',
    title: '标签名称',
    edit: props.assigned
      ? undefined
      : {
          component: Input,
          props: { clearable: true },
          rules: [{ required: true, message: '请输入标签名称' }],
          onEdited: (context: PrimaryTableOnEditedContext<TableRowData>) => {
            updateTag(context.newRowData.id, {
              tagKey: context.newRowData.tagKey,
              tagName: context.newRowData.tagName,
            }).then(() => {
              MessagePlugin.success('修改成功')
              getTagList()
            })
          },
          abortEditOnEvent: ['onEnter'],
        },
  },
  {
    colKey: 'createdAt',
    title: '创建时间',
  },
  {
    colKey: 'updatedAt',
    title: '修改时间',
  },
]
const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 0,
})

const selectedTagIds = ref([])
const onClickRemoveTags = () => {
  if (selectedTagIds.value.length > 0) {
    removeTags(selectedTagIds.value).then(() => {
      MessagePlugin.success('移除成功')
      selectedTagIds.value = []
      getTagList()
    })
  }
}
</script>

<style scoped></style>
