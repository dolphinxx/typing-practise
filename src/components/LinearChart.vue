<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

const props = defineProps<{ data: number[]; size: number; }>();

const canvasRef = ref() as Ref<HTMLCanvasElement>;
onMounted(drawChart);
function drawChart() {
  let data = props.data;
  if (data.length === 0) {
    return;
  }
  if (data.length > props.size) {
    data = downsampling(data, props.size);
  }
  const ctx: CanvasRenderingContext2D = canvasRef.value.getContext('2d')!;
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  let max = 0, min = 10240;
  for (let i = 1, len = data.length; i < len; i++) {
    const s = data[i];
    if (s > max) {
      max = s;
    } else if (s < min) {
      min = s;
    }
  }
  data = data.map(_ => _ - min);
  max = max - min;
  const dx = width / data.length;
  const dy = height / max ;
  console.log(width, height, min, max);

  const scale = (height - 12) / height;
  ctx.scale(scale, scale);
  const translateScale = (1 - scale) / 2;
  ctx.translate(translateScale * width, translateScale * height);
  // ctx.beginPath();
  // ctx.moveTo(0, 0);
  // ctx.lineTo(0, height);
  // ctx.lineTo(width, height);
  // ctx.strokeStyle = 'blue';
  // ctx.lineWidth = 1;
  // ctx.stroke();
  let minDrawn = false, maxDrawn = false;

  for (let i = 0, len = data.length; i < len; i++) {
    const s = data[i];
    const x = dx * i, y = height - s * dy;
    if (i === 0) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.fillStyle = 'red';
      // console.log(x, y);
      // ctx.fillRect(x - 2, y - 2, 4, 4);
      // ctx.fillText(s.toString(), x + 10, y - 10);
    } else {
      ctx.lineTo(x, y);
    }
    if (s === 0 && !minDrawn) {
      ctx.fillStyle = 'red';
      ctx.fillRect(x - 2, y - 2, 4, 4);
      ctx.fillText(min.toString(), x, y - 10);
      minDrawn = true;
    }
    if (s === max && !maxDrawn) {
      ctx.fillStyle = 'red';
      ctx.fillRect(x - 2, y - 2, 4, 4);
      ctx.fillText((s + min).toString(), x, y + 15);
      maxDrawn = true;
    }

  }
  ctx.fillStyle = 'black';
  ctx.stroke();
}

function downsampling(data: number[], target: number): number[] {
  const origin = data.length;
  const result: number[] = [];
  const ratio = origin / target;
  for (let i = 0; i < target; i++) {
    result[i] = data[Math.round(i * ratio)];
  }
  return result;
}
</script>
<template>
  <canvas ref="canvasRef" />
</template>