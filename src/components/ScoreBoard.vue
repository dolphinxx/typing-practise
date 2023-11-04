<script setup lang="ts">
import { computed, ref } from 'vue';
import LinearChart from '@/components/LinearChart.vue';

type Props = {
  time: number;
  charCount: number;
  mistakes: number;
  speedHistory: number[];
}
const props = defineProps<Props>();
const speed = computed(() => Math.trunc(props.charCount * 60000 / props.time));
const showing = ref(false);
defineExpose({
  show: () => showing.value = true,
});
</script>
<template>
  <div v-if="showing" class="scoreboard-container">
    <div class="scoreboard">
      <div class="score-item">
        <label>Total Chars:</label>
        <div>{{ charCount }}</div>
      </div>
      <div class="score-item">
        <label>Chars Per Minute:</label>
        <div>{{ speed }}</div>
      </div>
      <div class="score-item">
        <label>Mistakes:</label>
        <div>{{ mistakes }}</div>
      </div>
      <div>
        <linear-chart :data="speedHistory" :size="50" />
      </div>
      <button @click.stop="showing = false">Close</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.scoreboard-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.25);

  .scoreboard {
    width: 80%;
    height: 80%;
    padding: 24px 48px;
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 6px;

    .score-item {
      margin: 0 auto;
      display: flex;

      label {
        width: 10em;
      }
    }
  }
}
</style>