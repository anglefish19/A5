<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const text = ref("");
const image = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (text: string, image: string) => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { text, image },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  text.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(text, image)">
    <label for="text">Post Text:</label>
    <textarea id="text" v-model="text" placeholder="Insert text here"> </textarea>
    <label for="image">Image:</label>
    <textarea id="image" v-model="image" placeholder="Insert link to image here (make sure it's publicly accessible!)"> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
