<script setup lang="ts">
import ModalDialog from './ModalDialog.vue';
import { ref, type Ref, defineModel } from 'vue';
type Props = {
};
const defaultItem = { title: '', content: '' };
const articles = defineModel<Article[]>('articles', { required: true });
const value = defineModel<number>('value', { required: true });
defineProps<Props>();
const editingIndex = ref(-1);
const editingItem = ref<Article>({ ...defaultItem }) as Ref<Article>;
const editing = ref(false);
function addArticle() {
  editingIndex.value = -1;
  editingItem.value = { ...defaultItem };
  editing.value = true;
}
function editArticle(val: number) {
  editingIndex.value = val;
  editingItem.value = { ...articles.value[val] };
  editing.value = true;
}
function submitEdit() {
  const title = editingItem.value.title.trim();
  const content = editingItem.value.content.replace(/\r/g, '').trim();
  if (editingIndex.value === -1) {
    // adding
    articles.value.push({ title, content });
  } else {
    // editing
    articles.value[editingIndex.value] = { title, content };
  }
  editingItem.value = { ...defaultItem };
  editingIndex.value = -2;
  editing.value = false;
}
function removeArticle(val: number) {
  articles.value.splice(val, 1);
}
function chooseArticle(val: number) {
  value.value = val;
}
</script>
<template>
  <div class="articles-container">
    <div class="articles-toolbar">
      <button class="btn btn-primary" @click="addArticle">Add</button>
    </div>
    <div class="articles-items">
      <div v-for="(a, i) in articles" :key="i" class="article-item" :class="i === value ? 'active' : ''">
        <div class="article-item-main" @click="chooseArticle(i)">
          <div class="article-item-title">{{ a.title }}</div>
          <div class="article-item-content">{{ a.content }}</div>
        </div>
        <div class="article-item-action">
          <button class="btn btn-primary" @click="editArticle(i)">Edit</button>
          <button class="btn" @click="removeArticle(i)">Delete</button>
        </div>
      </div>
    </div>
    <modal-dialog v-model="editing" :submit="submitEdit" :css="{ width: '80%', height: '80%' }">
      <div class="article-item-form">
        <input placeholder="Article title" v-model="editingItem.title" />
        <textarea class="article-item-input" placeholder="Article content" v-model="editingItem.content" />
      </div>
    </modal-dialog>
  </div>
</template>
<style lang="scss" scoped>
.articles-container {
  .article-item-form {
    background-color: rgb(var(--v-theme-background));
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    height: 100%;

    input {
      border: none;
      border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      outline: none;
      font-size: 1.25rem;
      line-height: 1.5rem;
      padding: 0.5rem;
      margin-bottom: 1rem;

      &:focus {
        border-color: rgba(var(--v-theme-primary), var(--v-medium-emphasis-opacity));
      }
    }

    textarea {
      border: none;
      outline: none;
      font-size: 1.125rem;
      padding: 0.5rem;
      flex: 1;
      line-height: 1.5rem;
      resize: none;
      background-color: rgb(var(--v-theme-background));

      &:focus {
        background-color: rgba(var(--v-theme-primary), 0.04);
      }
    }

    .article-item-form-actions {
      display: flex;
      justify-content: end;
      margin-top: 1rem;

      button {
        &:not(:first-child) {
          margin-left: 0.5rem;
        }
      }
    }
  }

  .article-item {
    display: flex;
    padding: 0 1rem;

    &:hover {
      background-color: rgba(var(--v-theme-primary), var(--v-hover-opacity));
    }
  }

  .article-item-main {
    flex: 1;
    padding-bottom: 0.5rem;
  }

  .article-item-action {
    display: flex;
    flex-direction: column;
    justify-content: center;

    button {}
  }

  .article-item-title {
    font-size: 1.25rem;
    padding: 0.5rem 0.5rem 0 0.5rem;
  }

  .article-item-content {
    font-size: 1rem;
    padding: 0.5em 0.5em 0 0.5em;
    height: 3.5em;
    line-height: 1.5em;
    overflow: hidden;
    word-break: break-all;
  }

  .articles-toolbar {
    height: 3.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: end;

    button {
      flex-grow: 0;
      flex-shrink: 0;

      &:not(:first-child) {
        margin-left: 0.5rem;
      }
    }
  }
}
</style>