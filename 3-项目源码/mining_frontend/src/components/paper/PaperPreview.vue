<template>
  <div v-loading="loading" style="height: 100%; width: 100%">
    <iframe
      id="htmlFrame"
      ref="htmlFrameRef"
      frameborder="1"
      style="height: 100%; width: 100%"
      v-if="props.htmlId"
    ></iframe>
    <div v-else>暂无数据</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { download } from '@/apis/file'
import { watchEffect } from 'vue'

interface Props {
  htmlId?: string
}
const props = defineProps<Props>()

const htmlData = ref('')
const htmlFrameRef = ref()
const loading = ref(false)

const fileReader = new FileReader()
fileReader.onload = (e) => {
  htmlData.value = e.target!.result as string
  htmlFrameRef.value.contentDocument.documentElement.innerHTML = htmlData.value
  const zoom = (htmlFrameRef.value.clientWidth || 600) / 620
  htmlFrameRef.value?.contentDocument?.documentElement.style.setProperty(
    'zoom',
    zoom + '',
  )
  loading.value = false
}
fileReader.onerror = () => {
  console.error('文件读取失败')
  loading.value = false
}
if (!window.FileReader) {
  console.error('您的浏览器版本过低，请升级')
}

watchEffect(() => {
  if (props.htmlId) {
    loading.value = true
    download(props.htmlId).then((res) => {
      fileReader.readAsText(res)
    })
  }
})
</script>

<style scoped></style>
