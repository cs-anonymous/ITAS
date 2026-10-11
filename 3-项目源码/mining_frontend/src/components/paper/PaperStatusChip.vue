<template>
  <v-chip :prepend-icon="paperStatusIcon" :color="paperStatusColor">
    {{ paperStatusText }}
  </v-chip>
</template>

<script setup lang="ts">
import { PaperStatus } from '@/types/enum'
import { computed } from 'vue'

interface Props {
  status: PaperStatus
}

const props = defineProps<Props>()

const paperStatusText = computed(() => {
  switch (props.status) {
    case PaperStatus.WAITING:
      return '等待转换'
    case PaperStatus.CONVERT_FINISH:
      return '转换完成'
    case PaperStatus.CONVERT_FAIL:
      return '转换失败'
    case PaperStatus.PARAGRAPH_FINISH:
      return '合成段落提取完成'
    case PaperStatus.PARAGRAPH_FAIL:
      return '合成段落提取失败'
    default:
      return ''
  }
})

const paperStatusIcon = computed(() => {
  switch (props.status) {
    case PaperStatus.WAITING:
      return 'mdi-circle-outline'
    case PaperStatus.CONVERT_FINISH:
    case PaperStatus.PARAGRAPH_FINISH:
      return 'mdi-check-circle-outline'
    case PaperStatus.CONVERT_FAIL:
    case PaperStatus.PARAGRAPH_FAIL:
      return 'mdi-close-circle-outline'
    default:
      return ''
  }
})

const paperStatusColor = computed(() => {
  switch (props.status) {
    case PaperStatus.WAITING:
      return 'primary'
    case PaperStatus.CONVERT_FINISH:
    case PaperStatus.PARAGRAPH_FINISH:
      return 'green'
    case PaperStatus.CONVERT_FAIL:
    case PaperStatus.PARAGRAPH_FAIL:
      return 'red'
    default:
      return ''
  }
})
</script>

<style scoped></style>
