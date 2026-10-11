<template>
  <div>
    <t-row :gutter="24">
      <t-col :span="preferenceStore.frameCol">
        <div class="content">
          <annotation-frame :file-id="paper?.htmlId"></annotation-frame>
        </div>
      </t-col>
      <t-col :span="preferenceStore.otherCol">
        <div class="content">
          <t-row :gutter="16">
            <t-col flex="88px">
              <t-button @click="onPreferBtnClick" theme="default">
                偏好设置
              </t-button>
            </t-col>
            <t-col flex="auto">
              <t-select v-model="selectedPaperId">
                <template #prefixIcon>
                  <file-pdf-icon></file-pdf-icon>
                </template>
                <t-option
                  v-for="p in paperOptions"
                  :key="p.id"
                  :value="p.id"
                  :label="p.identifier"
                ></t-option>
              </t-select>
            </t-col>
          </t-row>
          <t-tabs style="margin-top: 8px" default-value="data">
            <t-tab-panel value="data" label="数据">
              <div style="margin-top: 24px">
                <annotation-table
                  :show-creator-name="true"
                  :editable="false"
                  :deletable="false"
                ></annotation-table>
              </div>
            </t-tab-panel>
            <t-tab-panel value="statistic" label="统计">
              <div style="margin-top: 24px">
                <annotation-statistic
                  :identifier="paper?.identifier"
                ></annotation-statistic>
              </div>
            </t-tab-panel>
          </t-tabs>
        </div>
      </t-col>
    </t-row>
    <preference-drawer ref="perferenceDrawerRef"></preference-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePreferenceStore } from '@/stores/preference'
import AnnotationFrame from '@/components/AnnotationFrame.vue'
import AnnotationTable from '@/components/AnnotationTable.vue'
import AnnotationStatistic from '@/components/AnnotationStatistic.vue'
import PreferenceDrawer from './comp/PreferenceDrawer.vue'
import { FilePdfIcon } from 'tdesign-icons-vue-next'
import { useReviewInitializer } from './hooks/use-review-initializer'

const { paper, paperOptions, selectedPaperId } = useReviewInitializer()

const perferenceDrawerRef = ref()
const onPreferBtnClick = () => {
  perferenceDrawerRef.value.show()
}

const preferenceStore = usePreferenceStore()
</script>

<style scoped lang="less">
.content {
  padding: 24px;
  height: calc(100vh - 152px);
  border-radius: 8px;
  background: #fff;
}
</style>
