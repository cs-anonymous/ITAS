<template>
  <v-row>
    <v-col cols="3">
      <div v-loading="loading">
        <div class="d-flex">
          <v-dialog width="1024">
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                v-bind="props"
                :elevation="4"
                :loading="createLoading"
              >
                新建项目
                <v-icon end icon="mdi-plus-box-multiple-outline"></v-icon>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card class="pa-2">
                <v-card-title class="ml-2">新建项目</v-card-title>
                <v-card-text>
                  <v-text-field
                    label="项目名称"
                    :rules="[rules.required]"
                    v-model="projectForm.name"
                    clearable
                  ></v-text-field>
                  <v-textarea
                    label="项目简介"
                    :rules="[rules.required]"
                    v-model="projectForm.introduction"
                    clearable
                  >
                  </v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn variant="plain" @click="isActive.value = false">
                    关闭
                  </v-btn>
                  <v-btn
                    color="primary"
                    class="mr-4"
                    variant="tonal"
                    min-width="108"
                    @click="onCreateProject"
                    :disabled="!shouldCreate"
                    :loading="createLoading"
                  >
                    创建
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-pagination
            size="small"
            density="comfortable"
            showFirstAndLastPageBtn
            v-model="pagination.pageNum"
            :length="pagination.totalPage"
            :total-visible="7"
          ></v-pagination>
        </div>
        <div v-if="projectList.length > 0">
          <div v-for="p in projectList" :key="p.id" class="mt-4">
            <router-link :to="'/project/' + p.id" custom v-slot="{ navigate }">
              <v-card hover-shadow @click="navigate" :elevation="4">
                <template #title>
                  {{ p.name }}
                  <!--                  <v-chip-->
                  <!--                    class="ml-3"-->
                  <!--                    size="small"-->
                  <!--                    style="vertical-align: text-top"-->
                  <!--                  >-->
                  <!--                    {{ p.status }}-->
                  <!--                  </v-chip>-->
                </template>
                <template #subtitle>
                  <!--                  <v-chip-->
                  <!--                    class="ml-2"-->
                  <!--                    size="small"-->
                  <!--                    style="vertical-align: text-top"-->
                  <!--                  >-->
                  <v-icon start icon="mdi-clock-outline"></v-icon>
                  创建于{{ p.createdAt }}
                  <!--                  </v-chip>-->
                </template>
                <template #text>
                  {{ p.introduction }}
                </template>
              </v-card>
            </router-link>
          </div>
        </div>
        <empty-status v-else></empty-status>
      </div>
    </v-col>
    <v-col cols="9">
      <t-affix :offset-top="80">
        <t-alert
          theme="info"
          message="上传论文PDF文件以快速开始您的项目！"
          close
        />
        <div class="quickstart">
          <v-row no-gutters>
            <v-col offset="3" cols="2">
              <v-img
                :src="logoUrl"
                max-width="100px"
                style="text-align: right"
              ></v-img>
            </v-col>
            <v-col
              cols="7"
              style="
                color: #1a66c0;
                font-weight: bolder;
                margin: auto;
                position: relative;
              "
            >
              <p style="position: absolute">
                <span style="font-size: 40px; font-style: italic">MOFs </span>
                <span style="font-size: 20px">材料知识大模型</span>
              </p>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex" style="width: 70%; margin: auto">
          <v-file-input
            v-model="fileList"
            color="primary"
            counter
            chips
            label="上传论文PDF文件"
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
            @click="quickStartUpload"
            class="ml-3"
            size="large"
            :height="48"
            color="secondary"
            :disabled="fileList.length == 0"
          >
            快速开始
          </v-btn>
        </div>
        <v-chip-group
          v-model="choices"
          column
          multiple
          selected-class="text-primary"
          style="width: 70%; margin: auto"
        >
          <v-chip filter variant="outlined"> 1-paper-quick </v-chip>
          <v-chip filter variant="outlined"> 1-paper-advanced </v-chip>
          <v-chip filter variant="outlined"> n-paper-GPT-3.5 </v-chip>
          <v-chip filter variant="outlined"> n-paper-GPT-4 </v-chip>
          <v-chip filter variant="outlined"> n-paper-yiyan</v-chip>
        </v-chip-group>
      </t-affix>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import EmptyStatus from '@/components/base/EmptyStatus.vue'

import { useProjectList } from './useProjectList'
import { useCreateProject } from './useCreateProject'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'
import { quickStart } from '@/apis/project.ts'
import { useRouter } from 'vue-router'

const { loading, projectList, pagination } = useProjectList()
const { shouldCreate, createLoading, projectForm, onCreateProject } =
  useCreateProject()

const rules = {
  required: (value: string) => !!value || '必填项！',
}
const router = useRouter()
const fileList = ref([])
const choices = ref([])

const logoUrl = new URL(`@/assets/logo.png`, import.meta.url).href

const quickStartUpload = () => {
  MessagePlugin.success('文件开始上传')
  loading.value = true
  const form = new FormData()
  fileList.value.forEach((f) => {
    form.append('files', f)
  })
  quickStart(form).then((res) => {
    loading.value = false
    fileList.value = []
    pagination.pageNum = 1
    MessagePlugin.success('上传成功，可在标注文本列表中查看转换进度')
    // 跳转详情页
    router.push('/project/' + res.payload.id + '/synthesis-paragraph')
  })
}
</script>

<style scoped>
.quickstart {
  width: 70%;
  margin: 40px auto;
}
</style>
