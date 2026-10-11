import { createApp } from 'vue'
import App from './App.vue'

import router from './routes/index'

import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'

import '@/assets/less/reset.less'
import '@/assets/less/config.less'

const pinia = createPinia()
pinia.use(piniaPluginPersist)

createApp(App).use(router).use(pinia).use(TDesign).mount('#app')
