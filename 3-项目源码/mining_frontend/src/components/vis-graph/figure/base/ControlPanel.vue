<script setup lang="ts"></script>

<template>
  <t-form class="control-panel">
    <slot />
  </t-form>
</template>

<style scoped>
.control-panel {
  box-sizing: content-box;
  width: fit-content;
  height: fit-content;
  margin: 0.5rem 0;
  padding: 1rem 1.5rem 1rem 0.3rem;

  background-color: rgba(255, 255, 255, 0.96);

  border: 1px solid #dcdcdc;
  border-radius: 0.6rem;

  transition: box-shadow 0.2s cubic-bezier(0.38, 0, 0.24, 1);
}

.control-panel:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
