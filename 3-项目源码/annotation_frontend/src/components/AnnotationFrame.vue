<template>
    <t-loading
      attach="#htmlFrame"
      style="height: 100%"
      :loading="loading"
      :indicator="false"
    >
      <template #text>
        标注文本加载中...
        <t-progress
          style="margin-top: 4px"
          theme="line"
          :color="{ from: '#0052D9', to: '#00A870' }"
          :percentage="loadProgress"
          status="active"
        />
      </template>
      <iframe id="htmlFrame" ref="htmlFrameRef"></iframe>
      <div class="tool-box">
        <t-button
          shape="square"
          theme="default"
          @click="zoomIn"
          :disabled="loading"
        >
          <template #icon>
            <zoom-in-icon size="20px"></zoom-in-icon>
          </template>
        </t-button>
        <t-button
          shape="square"
          theme="default"
          style="margin-left: 4px"
          @click="zoomOut"
          :disabled="loading"
        >
          <template #icon>
            <zoom-out-icon size="20px"></zoom-out-icon>
          </template>
        </t-button>
      </div>
    </t-loading>
    <div id="checksum-test" style="opacity: 0; height: 0; overflow: hidden">
      <div style="background: red">
        这是一段html结构校验和的测试，不会展示给用户，请勿删除
        <span>This is the test for html <strong>checksum</strong></span>
      </div>
      <div>如果开启了浏览器插件（翻译、暗黑模式等），此段校验和会不同</div>
      <div>
        <span style="color: yellow">1234<span></span>567</span>7654321
        <span
          ><span
            ><span>abcd<span style="margin-left: 5px"></span></span></span
        ></span>
      </div>
      <span>以此保证用户标注时的html结构与服务器端一致</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, toRef } from 'vue'
  import { useAnnotationStore } from '@/stores/annotation'
  import { ZoomInIcon, ZoomOutIcon } from 'tdesign-icons-vue-next'
  
  import { useHtmlLoader } from './hooks/use-loader'
  import { useSerialization } from './hooks/use-serialization'
  import { useHighlighter } from './hooks/use-highlighter'
  
  interface Props {
    fileId: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    fileId: '',
  })
  const fileId = toRef(props, 'fileId')
  
  const htmlFrameRef = ref()
  
  const { loadHtml, zoomIn, zoomOut, loading, loadProgress } =
    useHtmlLoader(htmlFrameRef)
  const { highlightData, clearHighlight } = useHighlighter(htmlFrameRef)
  const { serializeToCurrentLabel, deserializePersentLabel, checkText } =
    useSerialization(htmlFrameRef)
  
  onMounted(() => {
    // 挂载后加载文本，反序列化location，高亮已标数据
    loadHtml(fileId, checkText, () => {
      deserializePersentLabel()
      highlightData()
    })
  })
  
  const annotationStore = useAnnotationStore()
  
  annotationStore.$onAction(({ name, args, after, onError }) => {
    // 订阅添加标注数据action，进行序列化相关操作
    if (name == 'addLabel') {
      serializeToCurrentLabel(clearHighlight)
      after(() => {
        highlightData()
      })
      onError(() => {
        highlightData()
      })
    }
    // 订阅修改标注数据action，如果修改了tagId，重新高亮
    if (name == 'updateLabel') {
      if (args && args[1].tagId) {
        after(() => {
          highlightData()
        })
      }
    }
    // 订阅删除标注数据action，删除后重新高亮
    if (name == 'removeLabel') {
      after(() => {
        highlightData()
      })
    }
  })
  </script>
  
  <style scoped>
  #htmlFrame {
    width: 100%;
    height: 100%;
  }
  .tool-box {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  :deep(.t-loading__text) {
    width: 60%;
    text-align: center;
  }
  </style>
  