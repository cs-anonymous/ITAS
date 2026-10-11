<template>
  <div>
    <t-row :gutter="24">
      <t-col :span="preferenceStore.frameCol">
        <div class="content" id="annotation-frame">
          <annotation-frame :file-id="task?.htmlId"></annotation-frame>
        </div>
      </t-col>
      <t-col :span="preferenceStore.otherCol" v-loading="taskLoading">
        <div class="content">
          <t-row :gutter="16">
            <t-col flex="88px">
              <t-button @click="showGuide" theme="default"> 使用说明 </t-button>
            </t-col>
            <t-col flex="88px">
              <t-button
                @click="showPreferenceDrawer"
                theme="default"
                id="prefer-btn"
              >
                偏好设置
              </t-button>
            </t-col>
            <t-col flex="auto">
              <t-button
                class="finish-btn"
                @click="changeTaskFinished"
                theme="success"
                v-if="!taskFinished"
              >
                <template #icon><check-icon></check-icon></template>
                完成标注
              </t-button>
              <t-button
                class="finish-btn"
                @click="changeTaskFinished"
                theme="primary"
                v-else
              >
                <template #icon><edit-icon></edit-icon></template>
                继续标注
              </t-button>
            </t-col>
          </t-row>
          <t-tabs
            v-model:value="tabsKey"
            style="margin-top: 8px"
            id="annotation-tabs"
          >
            <t-tab-panel value="selector" label="选择" v-if="!taskFinished">
              <div style="margin-top: 24px">
                <annotation-selector></annotation-selector>
              </div>
            </t-tab-panel>
            <t-tab-panel value="data" label="数据">
              <div style="margin-top: 24px">
                <annotation-table
                  :show-creator-name="false"
                  :deletable="!taskFinished"
                  :editable="!taskFinished"
                  :key="tableRefreshKey"
                ></annotation-table>
              </div>
            </t-tab-panel>
            <t-tab-panel value="statistic" label="统计">
              <div style="margin-top: 24px">
                <annotation-statistic
                  :identifier="task?.identifier"
                ></annotation-statistic>
              </div>
            </t-tab-panel>
          </t-tabs>
        </div>
      </t-col>
    </t-row>
    <preference-drawer ref="preferenceDrawerRef"></preference-drawer>
    <t-guide
      v-model="currentStep"
      :steps="steps"
      @change="onStepChange"
      @skip="onSkip"
      :skipButtonProps="{ content: '跳过且不再展示' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AnnotationFrame from '@/components/AnnotationFrame.vue'
import AnnotationSelector from '@/components/AnnotationSelector.vue'
import AnnotationTable from '@/components/AnnotationTable.vue'
import AnnotationStatistic from '@/components/AnnotationStatistic.vue'
import { usePreferenceStore } from '@/stores/preference'
import PreferenceDrawer from './comp/PreferenceDrawer.vue'
import { useAnnotationInitializer } from './hooks/use-annotation-initializer'
import { useGuide } from './hooks/use-guide'
import { CheckIcon, EditIcon } from 'tdesign-icons-vue-next'

const preferenceStore = usePreferenceStore()
const preferenceDrawerRef = ref()
const showPreferenceDrawer = () => {
  preferenceDrawerRef.value.show()
}

const { changeTaskFinished, task, taskFinished, taskLoading } =
  useAnnotationInitializer()

const tabsKey = ref('selector')
const tableRefreshKey = ref(new Date().getTime())
watch(taskFinished, () => {
  tabsKey.value = taskFinished.value ? 'data' : 'selector'
  if (taskFinished.value) {
    tableRefreshKey.value = new Date().getTime()
  }
})

const { showGuide, currentStep, steps, onStepChange, onSkip } =
  useGuide(tabsKey)
</script>

<style scoped lang="less">
.content {
  padding: 24px;
  height: calc(100vh - 152px);
  border-radius: 8px;
  background: #fff;
}
.finish-btn {
  width: 100%;
}
</style>
