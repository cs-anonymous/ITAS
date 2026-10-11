<template>
  <div class="logo-title">文本标注系统</div>
  <t-alert theme="error" class="alert">
    权限不足
    <template #operation>
      <router-link to="/home" custom v-slot="{ navigate }">
        <span @click="navigate">返回首页</span>
      </router-link>
    </template>
  </t-alert>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.alert {
  width: 80%;
  margin: 48px auto;
}
.logo-title {
  margin: 48px auto;
  color: @color-blue;
  font-weight: 700;
  font-size: 36px;
  font-style: italic;
  text-align: center;
}
</style>
