<script setup lang="ts">
const modelValue = defineModel();
</script>
<template>
  <label class="switch">
    <input type="checkbox" v-model="modelValue">
    <span class="check"></span>
  </label>
</template>
<style lang="scss" scoped>
.switch {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  position: relative;
  margin-right: 0.5em;
  user-select: none;

  input {
    position: absolute;
    left: 0;
    opacity: 0;
    outline: none;
    z-index: -1;
    vertical-align: baseline;
  }

  .check {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 2.75em;
    height: 1.575em;
    padding: 0.2em;
    border-radius: 0.7875em;
    background: #b5b5b5;
    transition: background .15s ease-out, box-shadow .15s ease-out;

    &:before {
      content: "";
      display: block;
      width: 1.175em;
      height: 1.175em;
      background: #f5f5f5;
      box-shadow: 0 3px 1px 0 rgba(0, 0, 0, .05), 0 2px 2px 0 rgba(0, 0, 0, .1), 0 3px 3px 0 rgba(0, 0, 0, .05);
      transition: transform .15s ease-out;
      will-change: transform;
      transform-origin: left;
      border-radius: 100%;
    }
  }

  input[type=checkbox]:checked+.check {
    background-color: rgb(var(--v-theme-primary));

    &:before {
      transform: translate3d(100%, 0, 0);
    }
  }
}
</style>