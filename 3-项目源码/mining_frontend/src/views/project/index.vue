<template>
  <div v-loading="loading">
    <v-card variant="tonal">
      <template #title>
        {{ project?.name }}
        <v-chip class="ml-2" size="small" style="vertical-align: text-top">
          <v-icon start icon="mdi-clock-outline"></v-icon>
          创建于{{ project?.createdAt }}
        </v-chip>
      </template>
      <template #subtitle>
        {{ project?.introduction }}
      </template>
      <template v-slot:append>
        <v-stepper
          :border="false"
          :elevation="0"
          :model-value="step"
          style="width: 688px"
        >
          <v-stepper-header>
            <template v-for="(n, idx) in steps" :key="idx">
              <v-stepper-item
                :title="n"
                :value="idx + 1"
                :complete="step > idx + 1"
              ></v-stepper-item>
              <v-divider
                v-if="idx < steps.length - 1"
                :key="idx + '-divider'"
              ></v-divider>
            </template>
          </v-stepper-header>
        </v-stepper>
      </template>
    </v-card>
    <div class="mt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProject } from './useProject'
import { computed } from 'vue'

const { loading, project } = useProject()
const steps = ['上传论文PDF', '合成段落提取', '合成条件抽取']

const route = useRoute()
const step = computed(() => route.meta.step as number)
</script>

<style scoped></style>
