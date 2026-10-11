<template>
  <v-layout full-height>
    <v-app-bar color="primary" :elevation="4">
      <v-app-bar-title class="font-weight-medium">
        <router-link to="/" custom v-slot="{ navigate }">
          <span @click="navigate" style="cursor: pointer">
            大模型赋能MOFs材料合成知识库
          </span>
        </router-link>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <div class="pa-4">
        <router-view></router-view>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts"></script>

<style scoped></style>
