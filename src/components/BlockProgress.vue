<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, withDefaults } from 'vue';

const props = withDefaults(defineProps<{ size?: number; duration?: number; }>(), { size: 4, duration: 2400 });
const index = ref(1);
let intervalId: number | undefined;
onMounted(() => {
  intervalId = setInterval(() => {
    if (index.value >= props.size) {
      index.value = 1;
    } else {
      index.value++;
    }
  }, props.duration / props.size);
});
onBeforeUnmount(() => {
  if (intervalId !== undefined) {
    clearInterval(intervalId);
  }
});
</script>
<template>
  <div class="block-progress" :style="{width: size * 24 + 'px'}">
    <span v-for="i in size" :key="i" :class="index >= i ? 'active' : ''">■</span>
  </div>
</template>
<style lang="scss" scoped>
.block-progress {
  display: flex;
  user-select: none;

  span {
    display: block;
    width: 24px;
    height: 24px;
    text-align: center;
    font-size: 24px;
    line-height: 1em;
    color: rgba(var(--v-border-color), var(--v-border-opacity));

    &.active {
      color: rgb(var(--v-theme-primary));
    }
  }
}
</style>