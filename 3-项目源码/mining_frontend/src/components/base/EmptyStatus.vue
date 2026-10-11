<template>
  <div style="vertical-align: center; text-align: center; margin-top: 40px">
    <v-row no-gutters align="center">
      <v-col style="margin: auto">
        <icon-font
          name="error-circle"
          size="5em"
          style="color: gainsboro; font-weight: lighter"
        ></icon-font>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div style="color: grey; margin: auto">
          &nbsp;&nbsp;&nbsp;暂无数据！
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { IconFont } from 'tdesign-icons-vue-next'
</script>
<style scoped></style>
