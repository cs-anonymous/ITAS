import { createApp } from 'vue'
import App from './App.vue'

import router from './routes/index'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'

import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import './assets/css/theme.css'

const vuetify = createVuetify({
  components,
})

import '@/assets/less/reset.less'

createApp(App).use(router).use(vuetify).use(TDesign).mount('#app')
