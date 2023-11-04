<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ time: number; chars: number; mistakes: number }>();
const displayTime = computed(() => `${Math.trunc(props.time / 60)}:${String(props.time % 60).padStart(2, '0')}`);
const charsPerMinute = computed(() => props.time === 0 ? 0 : Math.trunc(props.chars * 60 / props.time));
</script>
<template>
  <div class="state-board">
    <div class="state-board-item">
      <em>{{ displayTime }}</em>
      <div class="divider"></div>
      <label>Time</label>
    </div>
    <div class="state-board-item">
      <em>{{ chars }}</em>
      <div class="divider"></div>
      <label>Chars</label>
    </div>
    <div class="state-board-item">
      <em>{{ charsPerMinute }}</em>
      <div class="divider"></div>
      <label>CPM</label>
    </div>
    <div class="state-board-item">
      <em>{{ mistakes }}</em>
      <div class="divider"></div>
      <label>Mistakes</label>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.state-board {
  display: flex;
  flex-direction: row;

  .state-board-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5em;
    text-align: center;

    em {
      font-size: 1.5rem;
    }

    .divider {
      margin: 0.5em 0;
      border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }
  }
}</style>