<template>
  <t-head-menu theme="light" v-model="menuValue">
    <template #logo> <div class="logo-title">文本标注系统</div> </template>
    <t-menu-item
      value="/home"
      :to="{
        path: '/home',
      }"
    >
      标注项目
    </t-menu-item>
    <t-menu-item
      value="/admin"
      v-if="userStore.hasAdminRole"
      :to="{
        path: '/admin',
      }"
    >
      系统管理
    </t-menu-item>
    <template #operations>
      <t-dropdown placement="bottom-right" trigger="click">
        <t-button variant="text">
          {{ userStore.username }}
          <template #suffix>
            <chevron-down-icon></chevron-down-icon>
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="onClickLogout"> 退出登录 </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </template>
  </t-head-menu>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { ref, watchEffect } from 'vue'

const userStore = useUserStore()
const router = useRouter()
const onClickLogout = () => {
  userStore.logout().then(() => {
    MessagePlugin.success('退出成功')
    router.push('/login')
  })
}

const menuValue = ref('/home')
const route = useRoute()
watchEffect(() => {
  if (route.matched.length > 1) {
    if (route.matched[1].path == '/admin') {
      menuValue.value = '/admin'
    } else {
      menuValue.value = '/home'
    }
  }
})
</script>

<style scoped lang="less">
.logo-title {
  width: 140px;
  color: @color-blue;
  font-weight: 700;
  font-size: 20px;
  font-style: italic;
  border-right: 2px solid @color-blue;
}
</style>
