<template>
  <div style="width: 448px; margin: 0 auto">
    <t-card class="statistic-card">
      <span class="description">标注人员数量</span>
      <span class="number">{{ statistic.annotatorCount }}</span>
    </t-card>
    <t-card class="statistic-card">
      <span class="description">标注文本数量</span>
      <span class="number">{{ statistic.paperCount }}</span>
    </t-card>
    <t-card class="statistic-card">
      <span class="description">标注标签数量</span>
      <span class="number">{{ statistic.tagCount }}</span>
    </t-card>
    <div>
      <t-input-number
        v-model="threshold"
        label=" 每篇文本由"
        suffix="名用户标注 "
        auto-width
        :min="1"
        :max="statistic.annotatorCount"
        style="width: 100%"
      ></t-input-number>
      <t-button
        theme="primary"
        type="submit"
        block
        style="margin-top: 24px"
        @click="onAssignTask"
      >
        分配任务
      </t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getStatistic, assignTask } from '@/apis/task'
import { checkIdentifier } from '@/apis/paper'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'

interface Props {
  projectId: string
}

const props = defineProps<Props>()
const emits = defineEmits(['refresh'])

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

const threshold = ref(1)
const onAssignTask = () => {
  checkIdentifier(props.projectId).then((res) => {
    if (res.payload.length > 0) {
      DialogPlugin({
        header: '文本标识符唯一性检查',
        body: '该项目中存在重复的文本标识符，文本标识符用于后续导出结果时对应标注文本，应在标注项目范围内唯一，请检查后重新提交。',
        footer: false,
        theme: 'danger',
      })
    } else {
      const dia = DialogPlugin.confirm({
        header: '分配任务确认',
        body: `该项目共包含${statistic.annotatorCount}名标注人员，${statistic.paperCount}篇标注文章，${statistic.tagCount}个标注标签，每篇文章由${threshold.value}人同时标注。分配任务后，将无法再对标注人员、标注文本、标注标签等配置进行修改，请确认。`,
        onConfirm() {
          assignTask({
            projectId: props.projectId,
            threshold: threshold.value,
          })
            .then((res) => {
              if (res.payload) {
                MessagePlugin.success('分配成功')
                emits('refresh')
              }
            })
            .finally(() => {
              dia.hide()
            })
        },
        theme: 'info',
      })
    }
  })
}
</script>

<style scoped>
.statistic-card {
  margin-bottom: 24px;
}
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
