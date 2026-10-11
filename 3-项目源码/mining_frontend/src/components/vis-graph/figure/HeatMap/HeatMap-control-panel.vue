<script setup lang="ts">
import { defineModel } from 'vue'

import ControlPanel from '../base/ControlPanel.vue'

const shape = defineModel('shape')
</script>

<template>
  <ControlPanel>
    <t-form-item label="形状">
      <t-radio-group v-model="shape">
        <t-radio value="rect"> 矩形 </t-radio>
        <t-radio value="circle"> 圆形 </t-radio>
        <t-radio value="text"> 文字 </t-radio>
        <t-radio value="numerical"> 数值颜色 </t-radio>
      </t-radio-group>
    </t-form-item>
  </ControlPanel>
</template>

<style scoped></style>
