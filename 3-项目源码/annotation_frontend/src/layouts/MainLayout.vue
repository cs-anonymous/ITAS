<template>
  <t-layout>
    <t-header style="padding: 0 24px">
      <header-nav></header-nav>
    </t-header>
    <t-content style="padding: 24px">
      <router-view class="view-content"></router-view>
    </t-content>
  </t-layout>
</template>

<script setup lang="ts">
import HeaderNav from './HeaderNav.vue'
</script>

<style scoped lang="less">
.view-content {
  min-height: calc(100vh - 56px - 48px);
}
</style>
