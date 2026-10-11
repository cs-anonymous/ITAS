<template>
  <div class="register-main">
    <div class="title">欢迎使用<span> 文本标注系统 </span></div>
    <div class="tips">
      已有账号？
      <router-link to="/login" custom v-slot="{ navigate }">
        <t-link hover="color" @click="navigate">去登录</t-link>
      </router-link>
    </div>
    <t-form
      ref="formRef"
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

      <t-form-item name="realName">
        <t-input
          v-model="formData.realName"
          clearable
          placeholder="姓名"
          size="large"
        >
          <template #prefix-icon>
            <creditcard-icon />
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
          @change="onPasswordInputChange"
        >
          <template #prefix-icon>
            <lock-on-icon />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="checkPassword">
        <t-input
          v-model="formData.checkPassword"
          type="password"
          clearable
          placeholder="确认密码"
          size="large"
        >
          <template #prefix-icon>
            <lock-on-icon />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item>
        <t-button theme="primary" type="submit" block size="large">
          注册
        </t-button>
      </t-form-item>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FormRules, SubmitContext, MessagePlugin } from 'tdesign-vue-next'
import { UserIcon, LockOnIcon, CreditcardIcon } from 'tdesign-icons-vue-next'
import { usernameExist, register } from '@/apis/user'
import { useRouter } from 'vue-router'

interface FormData {
  username: string
  realName: string
  password: string
  checkPassword: string
}

const formData = reactive<FormData>({
  username: '',
  realName: '',
  password: '',
  checkPassword: '',
})

const formRules: FormRules<FormData> = {
  username: [
    { required: true, message: '请输入用户名' },
    {
      min: 4,
      max: 16,
      pattern: /^[A-Za-z][A-Za-z0-9_]{3,15}$/,
      message: '用户名应为4-16位字母/数字/下划线的组合，且以字母开头',
    },
    {
      validator: async (val: string) => {
        return !(await usernameExist(val).then((res) => {
          return res.payload
        }))
      },
      message: '用户名已存在',
      trigger: 'blur',
    },
  ],
  realName: [{ required: true, message: '请输入姓名' }],
  password: [
    { required: true, message: '请输入密码', type: 'error' },
    {
      min: 6,
      max: 16,
      message: '密码应为6-16位',
    },
  ],
  checkPassword: [
    { required: true, message: '请再次输入密码', type: 'error' },
    {
      validator: (val: string) => val === formData.password,
      message: '两次密码输入不一致',
    },
  ],
}

const formRef = ref()
const onPasswordInputChange = () => {
  if (formData.checkPassword) {
    formRef.value.validate({ fileds: ['checkPassword'] })
  }
}

const router = useRouter()
const onSubmit = (context: SubmitContext) => {
  if (context.validateResult === true) {
    register({
      username: formData.username,
      realName: formData.realName,
      password: formData.password,
    }).then(() => {
      MessagePlugin.success('注册成功，请登录')
      router.push('/login')
    })
  }
}
</script>

<style lang="less" scoped>
.register-main {
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
