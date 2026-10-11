<template>
  <t-drawer
    v-model:visible="preferenceDrawerVisible"
    placement="right"
    mode="overlay"
    header="全局偏好设置"
    size="580px"
    :footer="false"
  >
    <t-form
      label-width="128px"
      colon
      label-align="left"
      style="padding-right: 8px"
    >
      <t-form-item
        label="数据表格显示备注"
        help="在数据标签页展示标注数据时，显示备注列。"
      >
        <t-switch v-model="preferenceStore.showRemarkInDataTable" />
      </t-form-item>
      <t-form-item
        label="标注文本宽度"
        help="根据您的屏幕，自定义页面左侧标注文本和右侧标注操作区域的宽度比例。"
        class="slider-form-item"
      >
        <t-slider
          :marks="{
            3: '1/4',
            4: '1/3',
            6: '1/2',
            8: '2/3',
            9: '3/4',
            10: '5/6',
          }"
          label="${value}%/12"
          :min="3"
          :max="10"
          :step="1"
          show-step
          v-model:value="preferenceStore.frameCol"
        />
      </t-form-item>
      <t-form-item label="文本高亮颜色">
        <template #help>
          <div>
            按顺序自定义文本高亮显示颜色。
            <strong style="text-decoration: underline">
              (与项目返回的标签/标注人顺序关联)
            </strong>
          </div>
          不同项目可能由于标签/标注人顺序的差异导致显示颜色不同。
        </template>
        <div>
          <div
            v-for="(c, index) in preferenceStore.colorList"
            :key="index"
            :index="Number(index)"
            style="margin-bottom: 8px; display: flex"
          >
            <t-color-picker
              v-model:value="c.value"
              enable-alpha
              format="HEX"
              :swatch-colors="preferenceStore.presetColors"
            />
          </div>
        </div>
      </t-form-item>
    </t-form>
    <t-form-item label-width="128px" style="margin-top: 8px">
      <t-button theme="default" @click="preferenceStore.$reset()" block>
        恢复默认配置
      </t-button>
    </t-form-item>
  </t-drawer>
</template>

<script setup lang="ts">
import { usePreferenceStore } from '@/stores/preference'
import { ref } from 'vue'

const preferenceStore = usePreferenceStore()

const preferenceDrawerVisible = ref(false)

const show = () => {
  preferenceDrawerVisible.value = true
}

defineExpose({ show })
</script>

<style scoped lang="less">
.slider-form-item {
  :deep(.t-form__controls-content) {
    margin-bottom: 16px;
  }
  margin-bottom: 8px;
}
</style>
