<script setup lang="ts">

defineProps<{ title?: string; css?: Record<string, any>; submit?: () => void; cancel?: (() => void) | null; }>();
const modelValue = defineModel();
</script>
<template>
  <div v-if="modelValue" class="modal">
    <div class="modal-background"></div>
    <div class="modal-body" :style="css">
      <div v-if="title" class="modal-header">{{ title }}</div>
      <div class="modal-content">
        <slot></slot>
      </div>
      <div v-if="submit || cancel !== null" class="modal-actions">
        <slot name="actions">
          <div class="spacer"></div>
          <button v-if="cancel !== null" @click="() => cancel ? cancel() : modelValue = false" class="btn">Cancel</button>
          <button v-if="submit" @click="submit" class="btn btn-primary" style="margin-left: 1rem;">Submit</button>
        </slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 22;

  .modal-background {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.75);
  }

  .modal-header {
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  .modal-body {
    max-width: 80%;
    max-height: 80%;
    display: flex;
    flex-direction: column;
    border-radius: 0.25rem;
    padding: 1rem;
    z-index: 23;
    background-color: rgb(var(--v-theme-background));
  }
  .modal-content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .modal-actions {
    display: flex;
    margin-top: 1rem;
    width: 100%;
  }
}
</style>