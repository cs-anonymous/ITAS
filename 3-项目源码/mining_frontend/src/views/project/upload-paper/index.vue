<template>
  <div class="d-flex">
    <v-file-input
      v-model="fileList"
      color="primary"
      counter
      chips
      label="论文PDF文件"
      hint="上传pdf格式的论文文件，单次上传文件总大小不超过100MB，如数量较多建议分为多次上传。"
      multiple
      prepend-icon="mdi-file-upload-outline"
      variant="outlined"
      :show-size="1000"
      accept=".pdf"
      density="comfortable"
    >
      <template v-slot:selection="{ fileNames }">
        <template v-for="(fileName, index) in fileNames" :key="fileName">
          <v-chip
            v-if="index < 10"
            label
            color="primary"
            size="small"
            class="me-2"
          >
            {{ fileName }}
          </v-chip>
          <span
            v-else-if="index === 10"
            class="text-overline text-grey-darken-3 mx-2"
          >
            +{{ fileList.length - 10 }} File(s)
          </span>
        </template>
      </template>
    </v-file-input>
    <v-btn
      @click="uploadPapers"
      class="ml-3"
      size="large"
      :height="48"
      color="secondary"
      :disabled="fileList.length == 0"
    >
      上传文件
    </v-btn>
    <v-btn
      class="ml-3"
      size="large"
      color="primary"
      :height="48"
      @click="nextStep"
      :disabled="!hasParagraphFinish"
    >
      查看合成段落
      <v-icon icon="mdi-step-forward"></v-icon>
    </v-btn>
  </div>
  <v-data-table-server
    :headers="headers"
    v-model:items-per-page="pagination.pageSize"
    :items-length="pagination.total"
    v-model:page="pagination.pageNum"
    :items="paperList"
    :loading="loading"
    loading-text="更新论文状态..."
    @update:options="getPaperList"
  >
    <template #item.status="{ value }">
      <PaperStatusChip :status="value"></PaperStatusChip>
    </template>
    <template #item.download="{ item }">
      <v-icon icon="mdi-printer-search" @click="preview(item.htmlId)"></v-icon>
      <v-icon
        icon="mdi-file-download-outline"
        class="ml-4"
        @click="downloadFileById(item.pdfId, item.filename)"
      ></v-icon>
    </template>
  </v-data-table-server>
  <v-dialog width="1024" v-model="previewVisible">
    <v-card class="pa-2" height="720">
      <PaperPreview :html-id="previewHtmlId"></PaperPreview>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { uploadPaper } from '@/apis/paper.ts'
import { MessagePlugin } from 'tdesign-vue-next'
import { downloadFileById } from '@/utils/download'
import { usePaperList } from './usePaperList'
import PaperPreview from '@/components/paper/PaperPreview.vue'
import PaperStatusChip from '@/components/paper/PaperStatusChip.vue'

const route = useRoute()
const projectId = route.params.id as string
const fileList = ref([])

const { paperList, pagination, getPaperList, loading, hasParagraphFinish } =
  usePaperList()

const headers: readonly {}[] = [
  {
    title: '论文名称',
    key: 'filename',
    sortable: false,
  },
  { title: '上传时间', key: 'createdAt', sortable: false },
  { title: '转换状态', key: 'status', sortable: false, align: 'center' },
  {
    title: '预览/下载文件',
    key: 'download',
    sortable: false,
    align: 'center',
  },
]

const uploadPapers = () => {
  MessagePlugin.success('文件开始上传')
  loading.value = true
  const form = new FormData()
  form.append('projectId', projectId)
  fileList.value.forEach((f) => {
    form.append('files', f)
  })
  uploadPaper(form).then(() => {
    loading.value = false
    fileList.value = []
    pagination.pageNum = 1
    getPaperList()
    MessagePlugin.success('上传成功，可在标注文本列表中查看转换进度')
  })
}

const router = useRouter()
const nextStep = () => {
  router.push({
    name: 'synthesisParagraph',
  })
}

const previewHtmlId = ref('')
const previewVisible = ref(false)
const preview = (id: string) => {
  if (id) {
    previewVisible.value = true
    previewHtmlId.value = id
  }
}
</script>

<style scoped></style>
