<template>
  <div>
    <div class="d-flex">
      <v-select
        label="选择论文查看合成段落"
        density="comfortable"
        hide-details
        :items="paperList"
        item-title="filename"
        item-value="id"
        return-object
        v-model="selectedPaper"
        variant="outlined"
        :loading="paperLoading"
        color="primary"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :key="item.raw.id"
            :disabled="item.raw.status !== PaperStatus.PARAGRAPH_FINISH"
          >
            <template #title>
              {{ item.raw.filename }}
              <PaperStatusChip :status="item.raw.status" class="ml-3" />
            </template>
          </v-list-item>
        </template>
      </v-select>
      <v-btn
        size="large"
        color="secondary"
        :height="48"
        @click="prevStep"
        class="ml-3"
      >
        上一步
      </v-btn>
    </div>
    <v-row v-if="!quickLoading" class="mt-3" no-gutters>
      <v-col :cols="5" class="main-height-preview pr-3 mt-2">
        <PaperPreview :html-id="selectedPaper?.htmlId"></PaperPreview>
      </v-col>
      <v-col :cols="4" v-loading="paragraphLoading" class="main-height mt-2">
        <v-card
          class="mb-3"
          variant="outlined"
          color="grey-darken-3"
          v-for="(pa, idx) in paragraphList"
          :key="idx"
        >
          <template #append>
            <v-btn
              :icon="pa.available ? 'mdi-star' : 'mdi-star-outline'"
              class="mt-n2"
              @click="changeAvailable(pa.id, pa.available)"
              variant="tonal"
              :color="pa.available ? 'primary' : ''"
              :loading="loadingBtnId == pa.id"
            ></v-btn>
          </template>
          <template #title>{{ selectedPaper?.filename }}</template>
          <template #subtitle>合成段落{{ idx + 1 }}</template>
          <template #text>{{ pa.content }}</template>
        </v-card>
      </v-col>
      <v-col :cols="3" class="main-height" style="overflow-x: hidden">
        <v-row class="pr-2">
          <v-col :cols="12" class="ml-2 mt-2">
            <div class="d-flex">
              <v-select
                label="选择合成参数抽取任务"
                density="comfortable"
                hide-details
                :items="taskList"
                item-title="name"
                item-value="id"
                return-object
                v-model="currentTask"
                variant="outlined"
                :loading="taskLoading"
                color="primary"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :key="item.raw.id">
                    <template #title>
                      {{ item.raw.name }}-model:{{ item.raw.model }}-size:{{
                        item.raw.size
                      }}
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </div>
          </v-col>
        </v-row>
        <v-row class="pl-2" style="margin-top: -4px">
          <v-col :cols="12">
            <v-btn
              block
              size="large"
              color="primary"
              :height="48"
              @click="nextStep"
              :disabled="taskList?.length == 0"
            >
              查看合成条件抽取结果 <v-icon icon="mdi-step-forward"> </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12">
            <v-card variant="outlined" class="ml-2">
              <template #text>
                <v-select
                  v-model="promptForm.model"
                  label="模型选择"
                  :items="[
                    'gpt-3.5-turbo-0125',
                    'gpt-4-0125-preview',
                    'ERNIE-Bot',
                    'ERNIE-Bot-4',
                  ]"
                ></v-select>
                <v-text-field
                  label="调整随机性，数值越大随机性越大"
                  v-model="promptForm.temperature"
                  :min="0"
                  :max="maxTemperature"
                  :rules="rules.temperatureRules"
                ></v-text-field>
                <v-select
                  label="sampling"
                  v-model="promptForm.sampling"
                  :items="['bert', 'static']"
                  v-show="showAdvance"
                ></v-select>
                <v-text-field
                  label="样本数量"
                  v-model="promptForm.size"
                  type="number"
                  :min="0"
                  :max="10"
                  v-if="promptForm.sampling == 'bert'"
                ></v-text-field>
                <v-text-field
                  label="样本数量"
                  v-model="promptForm.size"
                  type="number"
                  :min="0"
                  :max="10"
                  v-else
                ></v-text-field>
                <v-btn
                  block
                  variant="text"
                  class="mb-2"
                  @click="switchAdvance"
                  v-show="showAdvance"
                  >收起</v-btn
                >
                <v-btn
                  color="primary"
                  block
                  @click="onSubmitTask"
                  :loading="createLoading"
                >
                  创建合成条件抽取任务
                  <v-icon icon="mdi-folder-plus-outline" class="ml-1"></v-icon>
                </v-btn>
                <v-btn
                  block
                  variant="text"
                  class="mt-2"
                  @click="switchAdvance"
                  v-show="!showAdvance"
                  >展开高级配置</v-btn
                >
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div v-else class="paragraphLoading">
      <v-progress-linear
        indeterminate
        color="cyan"
        height="5"
      ></v-progress-linear>
      <div style="margin-top: 20px">等待格式转换及合成段提取完成...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePaperList } from './usePaperList'
import { useParagraphList } from './useParagraphList'
import PaperStatusChip from '@/components/paper/PaperStatusChip.vue'
import PaperPreview from '@/components/paper/PaperPreview.vue'
import { useRoute, useRouter } from 'vue-router'
import { watch, ref, reactive } from 'vue'
import { updateParagraphAvailable } from '@/apis/paragraph'
import { PaperStatus } from '@/types/enum.ts'
import { createTask } from '@/apis/task.ts'
import { MessagePlugin } from 'tdesign-vue-next'
import { useTaskList } from '@/views/project/entity-extract/useTaskList.ts'

const { paperList, paperLoading, selectedPaper, quickLoading } = usePaperList()
const { paragraphList, getParagraphList, paragraphLoading } = useParagraphList()
const { taskList, taskLoading, currentTask } = useTaskList()

watch(selectedPaper, () => {
  if (selectedPaper.value) {
    getParagraphList(selectedPaper.value.id)
  }
})

const router = useRouter()
const nextStep = () => {
  router.push('entity-extract/' + currentTask.value?.id)
}
const prevStep = () => {
  router.push({
    name: 'uploadPaper',
  })
}

const loadingBtnId = ref('')
const changeAvailable = (id: string, available: boolean) => {
  const idx = paragraphList.value.findIndex((pg) => id == pg.id)
  if (idx != -1) {
    loadingBtnId.value = id
    updateParagraphAvailable(id, !available)
      .then((res) => {
        if (res.payload) {
          paragraphList.value[idx].available = !available
        }
      })
      .finally(() => {
        loadingBtnId.value = ''
      })
  }
}

const route = useRoute()
const createLoading = ref(false)
interface PromptFrom {
  size: number
  model:
    | 'gpt-3.5-turbo-0125'
    | 'gpt-4-0125-preview'
    | 'ERNIE-Bot'
    | 'ERNIE-Bot-4'
  temperature: number
  sampling: string
}
const promptForm = reactive<PromptFrom>({
  size: 1,
  model: 'gpt-3.5-turbo-0125',
  temperature: 0,
  sampling: 'static',
})
const onSubmitTask = () => {
  const projectId = route.params.id as string
  if (projectId) {
    createLoading.value = true
    createTask({
      size: promptForm.size,
      model: promptForm.model,
      temperature: promptForm.temperature,
      sampling: promptForm.sampling,
      projectId,
    }).then((res) => {
      createLoading.value = false
      if (res.payload) {
        MessagePlugin.success('创建任务成功，请稍后前往结果页查看！')
        // 刷新taskList
        location.reload(true)
      }
    })
  }
}

const showAdvance = ref(false)
const switchAdvance = () => {
  showAdvance.value = !showAdvance.value
}

const maxTemperature = () => {
  if (
    promptForm.model === 'gpt-3.5-turbo-0125' ||
    promptForm.model === 'gpt-4-0125-preview'
  ) {
    return 2
  } else {
    return 1
  }
}
const rules = {
  temperatureRules: [
    (value: number) => value >= 0 || '随机性不能小于 0',
    (value: number) =>
      value <= maxTemperature() ||
      '随机性不能大于 ' + maxTemperature().toString(),
  ],
}
</script>

<style scoped lang="less">
.main-height {
  height: calc(100vh - 264px);
  overflow-y: scroll;
}
.main-height-preview {
  height: calc(100vh - 264px);
  overflow: hidden;
}
.paragraphLoading {
  width: 70%;
  margin: auto;
  padding-top: 200px;
  text-align: center;
}
</style>
