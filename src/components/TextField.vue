<script setup lang="ts">
const modelValue = defineModel();
</script>
<template>
  <div class="text-field">
    <input v-model="modelValue">
  </div>
</template>
<style lang="scss" scoped>
.text-field {
  input {
    -moz-appearance: none;
    -webkit-appearance: none;
    border-radius: 4px;
    outline: none;
    height: 2.5em;
    font-size: 1rem;
    line-height: 1.5em;
    padding: calc(0.5em - 1px) 0.75em;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

    &:focus {
      border-color: rgba(var(--v-theme-primary), var(--v-medium-emphasis-opacity));
    }
  }
}
</style>