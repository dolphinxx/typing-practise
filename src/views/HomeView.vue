<script setup lang="ts">
import BlockProgress from '@/components/BlockProgress.vue';
import TypingInput from '@/components/TypingInput.vue';
import ScoreBoard from '@/components/ScoreBoard.vue';
import StateBoard from '@/components/StateBoard.vue';
import ArticleList from '@/components/ArticleList.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import SwitchField from '@/components/SwitchField.vue';
import TextField from '@/components/TextField.vue';
import { ref, type Ref, onMounted, watch } from 'vue';

const initialized = ref(false);
const starting = ref(false);
const settling = ref(false);
const typingInputRef = ref() as Ref<typeof TypingInput>;
const showingSettings = ref(false);
const showingList = ref(false);
const showingWelcome = ref(false);

const articles = ref() as Ref<Article[]>;
const settings = ref() as Ref<Settings>;
watch(articles, saveArticles, { deep: true });
const article = ref() as Ref<Article>;
const startTime = ref(0);
let timerId: number | undefined = undefined;
const inputCharCount = ref(0);
const mistakeCount = ref(0);
const speedHistory = ref([]) as Ref<number[]>;
let lastInputTime = 0;
const timeElapsed = ref(0);

onMounted(() => {
  setTimeout(() => {
    loadSettings();
    loadArticles();
    watch(() => settings.value.index, () => {
      stop();
      reset();
      article.value = articles.value[Math.min(articles.value.length - 1, settings.value.index)];
    });
    article.value = articles.value[Math.min(articles.value.length - 1, settings.value.index)];
    showWelcome();
    initialized.value = true;
  }, 1000);
});

function handleGlobalKey(e: Event) {
  if (showingList.value || showingSettings.value) {
    return true;
  }
  e.preventDefault();
  e.stopImmediatePropagation();
  start();
}

function showWelcome() {
  window.addEventListener('keydown', handleGlobalKey);
  showingWelcome.value = true;
}

function handleType(count: number, mistakes: number) {
  inputCharCount.value += count;
  mistakeCount.value += mistakes;
  const now = new Date().getTime();
  speedHistory.value.push(Math.trunc(count * 60000 / (now - lastInputTime)));
  lastInputTime = now;
}

function handleFinished() {
  stop();
}

function reset() {
  starting.value = false;
  inputCharCount.value = 0;
  mistakeCount.value = 0;
  timeElapsed.value = 0;
  speedHistory.value = [];
  startTime.value = lastInputTime = 0;
  typingInputRef.value?.reset();
}

function start() {
  showingWelcome.value = false;
  window.removeEventListener('keydown', handleGlobalKey);
  starting.value = true;
  startTime.value = lastInputTime = new Date().getTime();
  timerId = window.setInterval(() => timeElapsed.value = Math.trunc((new Date().getTime() - startTime.value) / 1000), 1000);
  typingInputRef.value?.start();
}

function stop() {
  if (timerId !== undefined) {
    window.clearInterval(timerId);
    timerId = undefined;
  }
}

function restart() {
  stop();
  reset();
  start();
}

function loadArticles() {
  const raw = window.localStorage.getItem('typing_practise_articles') || '[]';
  articles.value = JSON.parse(raw) as Article[];
  if (articles.value.length === 0) {
    articles.value.push({ title: 'Wolves have better teeth', content: `The endangered red wolf, a unique species found only in the United States, is making a slow comeback, thanks to a breeding and reintroduction program.\n\nThe Point Defiance Zoo in Tacoma, Washington, is playing a crucial role by providing dental care to these wolves because broken teeth can hinder their ability to eat properly. There are only around 270 red wolves left, with most of them in managed care or zoos, while only 20 live in the wild in eastern North Carolina. During recent checkups, the zoo’s veterinarians conducted dental cleanings and x-rays for the wolves, ensuring their overall health. Wolves in managed care live longer due to regular exams and dental care.\n\nRed wolves were once widespread but faced a decline in the past. Now, efforts are being made to protect and reintroduce them into the wild.` });
  }
}
function saveArticles() {
  window.localStorage.setItem('typing_practise_articles', JSON.stringify(articles.value));
}
function loadSettings() {
  const raw = window.localStorage.getItem('typing_practise_settings');
  if (!raw) {
    return {
      index: 0,
      fontSize: 36,
      lineHeight: 1.5,
      allowBackward: false,
    }
  }
  settings.value = JSON.parse(raw);
}
function saveSettings() {
  window.localStorage.setItem('typing_practise_settings', JSON.stringify(settings.value));
}

</script>

<template>
  <div class="container">
    <template v-if="initialized">
      <div class="header">
        <div class="current-article" @click="() => showingList = true">{{ article.title }}</div>
        <div class="spacer"></div>
        <div class="toolbar">
          <button class="btn" style="margin-right: 1rem" @click="restart">Restart</button>
          <button class="btn" @click="showingSettings = true">Settings</button>
        </div>
      </div>
      <div class="center elevation-2">
        <typing-input ref="typingInputRef" style="width: 100%;height: 100%;" :article="article.content" :allow-backward="settings.allowBackward" :font-size="settings.fontSize" :line-height="settings.lineHeight" @type="handleType" @finished="handleFinished"></typing-input>
        <score-board v-if="settling" :char-count="inputCharCount" :mistakes="mistakeCount" :speed-history="speedHistory" :time="startTime"></score-board>
        <div v-if="showingWelcome" class="welcome">
          <div>Press any key to start.</div>
        </div>
      </div>
      <div class="footer elevation-2">
        <state-board :time="timeElapsed" :chars="inputCharCount" :mistakes="mistakeCount" />
      </div>

    </template>
    <div v-if="!initialized" class="loading">
      <block-progress />
    </div>
  </div>
  <modal-dialog v-if="initialized" v-model="showingList">
    <article-list v-model:articles="articles" v-model:value="settings.index" />
  </modal-dialog>
  <modal-dialog v-model="showingSettings" title="Settings" :submit="() => { saveSettings(); showingSettings = false; }">
    <template v-slot:default>
      <div class="settings-form">
        <div class="form-field">
          <label class="control-label">Font Size:</label>
          <div class="form-control">
            <text-field v-model="settings.fontSize" />
          </div>
        </div>
        <div class="form-field">
          <label class="control-label">Line Height:</label>
          <div class="form-control">
            <text-field v-model="settings.lineHeight" />
          </div>
        </div>
        <div class="form-field">
          <label class="control-label">Allow Backward:</label>
          <div class="form-control">
            <switch-field v-model="settings.allowBackward" />
          </div>
        </div>
      </div>
    </template>
  </modal-dialog>
</template>
<style lang="scss" scoped>
.container {
  max-width: 1024px;
  height: 100vh;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header,
.footer {
  flex-grow: 0;
  flex-shrink: 0;
}

.header {
  height: 3.5em;
  padding: 0.5rem;
  display: flex;
}

.footer {
  padding: 12px;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.center {
  width: 100%;
  position: relative;
  flex: 1;
  overflow: hidden;
}

.welcome {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  width: 100%;
  height: 100%;
  background-color: rgba(var(--v-theme-background), 0.75);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.current-article {
  display: block;
  padding: 0.5em;
  line-height: 1.5em;
  cursor: pointer;

  &:hover {
    color: rgb(var(--v-theme-on-primary));
    background-color: rgba(var(--v-theme-primary), var(--v-medium-emphasis-opacity));
  }
}

.toolbar {
  display: flex;
}
</style>