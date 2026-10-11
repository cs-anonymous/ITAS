<template>
  <div class="login-main">
    <div class="title">欢迎使用<span> 文本标注系统 </span></div>
    <div class="tips">
      没有账号？
      <router-link to="/register" custom v-slot="{ navigate }">
        <t-link hover="color" @click="navigate">立即注册</t-link>
      </router-link>
    </div>
    <t-form
      ref="form"
      :data="formData"
      :rules="formRules"
      :label-width="0"
      @submit="onSubmit"
    >
      <t-form-item name="username">
        <t-input
          v-model="formData.username"
          clearable
          placeholder="用户名"
          size="large"
        >
          <template #prefix-icon>
            <user-icon />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          type="password"
          clearable
          placeholder="密码"
          size="large"
        >
          <template #prefix-icon>
            <lock-on-icon />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item>
        <t-button theme="primary" type="submit" block size="large">
          登录
        </t-button>
      </t-form-item>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { FormRules, MessagePlugin, SubmitContext } from 'tdesign-vue-next'
import { UserIcon, LockOnIcon } from 'tdesign-icons-vue-next'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

interface FormData {
  username: string
  password: string
}

const formData = reactive<FormData>({
  username: '',
  password: '',
})

const formRules: FormRules<FormData> = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
    },
  ],
  password: [{ required: true, message: '密码不能为空' }],
}

const userStore = useUserStore()
const router = useRouter()
const onSubmit = (context: SubmitContext) => {
  if (context.validateResult === true) {
    userStore.login(formData.username, formData.password).then(() => {
      MessagePlugin.success('登录成功')
      router.push('/')
    })
  }
}
</script>

<style scoped lang="less">
.login-main {
  width: 448px;
  margin: 112px auto;
  .title {
    font-size: 24px;
    font-weight: 700;
    span {
      margin-left: 8px;
      font-size: 40px;
      color: @color-blue;
    }
  }
  .tips {
    margin: 24px 0;
    font-size: 14px;
    color: #999;
  }
}
</style>
