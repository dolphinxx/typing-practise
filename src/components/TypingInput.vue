<script setup lang="ts">
import { computed, nextTick, onMounted, onUpdated, ref, type Ref } from 'vue';

type Props = { article: string; fontSize: number; lineHeight: number; allowBackward?: boolean; };

type Token = {
  c: string;
  type: 'normal' | 'enter' | 'space';
  state: 'initial' | 'success' | 'error';
};
const content = ref('');
const inputRef = ref() as Ref<HTMLTextAreaElement>;
const articleRef = ref() as Ref<HTMLDivElement>;
const containerRef = ref() as Ref<HTMLDivElement>;
const props = withDefaults(defineProps<Props>(), { allowBackward: true });
const emit = defineEmits<{ (event: 'finished'): void, (event: 'type', count: number, mistakes: number): void }>();
const characters = computed(() => props.article.split('').map<Token>(_ => ({ c: _ === '\n' ? '' : _, type: _ === '\n' ? 'enter' : _ === ' ' ? 'space' : 'normal', state: 'initial' })));

const started = ref(false);
const articleHeight = ref(0);
const containerHeight = ref(0);
const lineHeightPx = ref(0);
const lines = ref(0);

function initMetrics() {
  articleHeight.value = articleRef.value.clientHeight;
  containerHeight.value = containerRef.value.clientHeight;
  lineHeightPx.value = props.lineHeight * props.fontSize;
  lines.value = Math.trunc(containerHeight.value / lineHeightPx.value);
}

function reset() {
  started.value = false;
  content.value = '';
  inputRef.value.value = '';
  inputRef.value.style.left = '';
  inputRef.value.style.top = '';
  for (let c of characters.value) {
    c.state = 'initial';
  }
}

function start() {
  started.value = true;
  nextTick(() => focusEnd());
}

onMounted(() => {
  initMetrics();
  focusEnd();
});

onUpdated(initMetrics);

function focusEnd() {
  inputRef.value?.focus();
  // window.getSelection()?.selectAllChildren(inputRef.value);
  // window.getSelection()?.collapseToEnd();
  inputRef.value.setSelectionRange(inputRef.value.value.length, inputRef.value.value.length);
}
function handleInput(e: InputEvent) {
  let val = (e.target as HTMLTextAreaElement).value;
  const inputType = e.inputType;
  let inputData = e.data;
  if (inputType === 'insertFromPaste') {
    const end = Math.min(val.length, characters.value.length);
    let i = content.value.length;
    for (; i < end; i++) {
      if (characters.value[i].state === 'initial') {
        characters.value[i].state = 'error'
        continue;
      }
      break;
    }
    const start = Math.max(i, 0);
    val = content.value.substring(0, start) + props.article.substring(start, end);
    postInput(val);
    return;
  }
  if (inputType === 'insertCompositionText' && (inputData === ' ' || inputData === null) && val[val.length - 1] === ' ') {
    // composition text placeholder
    nextTick(() => focusEnd());
    return;
  }
  if (inputType === 'deleteContentBackward') {
    if (val.length === content.value.length) {
      // skip ime clearing
      return;
    }
    if (props.allowBackward) {
      val = content.value.substring(0, content.value.length - 1);
      if (val.length < characters.value.length) {
        characters.value[val.length].state = 'initial';
      }
    } else {
      val = content.value;
    }
    postInput(val);
    return;
  }

  if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
    if (content.value.length < characters.value.length) {
      val = content.value + '\n';
      updateState(val, val.length - 1, val.length);
    }
    postInput(val);
    return;
  }
  if (inputType === 'insertCompositionText' || inputType === 'insertText') {
    // insertion
    if (content.value.length === val.length) {
      // repeated insertCompositionText when typing Chinese punctuation
      return;
    }
    const end = Math.min(val.length, characters.value.length);
    if (end < val.length) {
      val = val.substring(0, end);
    }
    updateState(val, content.value.length, end);
    postInput(val);
  }
}

function postInput(val: string) {
  content.value = val;
  inputRef.value.value = val;
  let token = articleRef.value.querySelector(`[data-id='${val.length}']`) as HTMLElement | null;
  if (token) {
    inputRef.value.style.left = token.offsetLeft + 'px';
    inputRef.value.style.top = token.offsetTop + 'px';
  } else {
    started.value = false;
    emit('finished');
    token = articleRef.value.querySelector('[data-id]:last-child') as HTMLElement;
    inputRef.value.style.left = (token.offsetLeft + token.offsetWidth) + 'px';
    inputRef.value.style.top = token.offsetTop + 'px';
  }
  nextTick(() => {
    focusEnd();
    const inputHeight = inputRef.value.offsetTop;
    if (articleHeight.value > containerHeight.value && inputHeight >= containerHeight.value - lineHeightPx.value * 2) {
      containerRef.value.scrollTop = (inputHeight / lineHeightPx.value + 2 - lines.value) * lineHeightPx.value + 12;
    }
  });

}

function updateState(val: string, start: number, end: number) {
  let v;
  let mistakes = 0;
  for (let i = start; i < end; i++) {
    v = characters.value[i];
    const c = val.charAt(i)
    if (v.type === 'enter' ? c === '\n' : c === v.c) {
      v.state = 'success';
    } else {
      v.state = 'error';
      mistakes++;
    }
  }
  if (start < end) {
    emit('type', end - start, mistakes);
  }
}
defineExpose({
  focusEnd,
  reset,
  start,
})
</script>
<template>
  <div ref="containerRef" class="typing-input-container" :style="{ fontSize: fontSize + 'px', lineHeight: lineHeight + 'em' }">
    <div class="typing-input-scroll" @mouseup="() => focusEnd()">
      <div ref="articleRef" class="typing-input-article">
        <span v-for="(char, i) in characters" :key="i" :data-id="i" :class="[char.type, char.state]">{{ char.c }}</span>
      </div>
      <textarea ref="inputRef" class="typing-input" spellcheck="false" :disabled="!started" @input="e => handleInput(e as InputEvent)" :data-len="content.length" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.typing-input-container {
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  .typing-input-scroll {
    width: 100%;
    min-height: 100%;
    position: relative;

    .typing-input {
      border: none;
      outline: none;
      padding: 0;
      font-size: inherit;
      font-family: inherit;
      line-height: inherit;
      display: block;
      resize: none;
      height: 1.5em;
      width: 2px;
      position: absolute;
      overflow: hidden;
      background-color: transparent;
      position: absolute;
      top: 0;
      color: transparent;
      caret-color: rgba(0, 0, 0, 0.5);
    }

    .typing-input-article {
      width: 100%;
      word-break: break-all;
      white-space: pre-wrap;
      letter-spacing: 0.05em;
      user-select: none;
      outline: none;
      min-height: 100%;
      color: rgba(0, 0, 0, 0.5);

      span {
        white-space: pre-wrap;
      }

      .enter,
      .space {
        position: relative;

        &:before {
          position: absolute;
          opacity: 0.15;
          color: rgb(0, 0, 0);
        }

        &.error:before {
          color: red;
        }

        &.success:before {
          color: green;
        }
      }

      .success {
        color: green;
      }

      .error {
        color: red;
      }

      .space:before {
        content: '␣';
      }

      .enter {
        &:before {
          content: '↵';
        }

        &:after {
          content: '\A';
        }
      }
    }
  }
}
</style>