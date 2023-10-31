<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const text = ref("");
const images = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (text: string, images: string) => {
  // https://stackoverflow.com/questions/55880196/is-there-a-way-to-easily-check-if-the-image-url-is-valid-or-not
  const res = await fetch(images);
  const buff = await res.blob();

  if (images && !buff.type.startsWith("image/")) {
    alert("Input for image is not a url that goes to an image.");
    throw Error("Input for image is not a url that goes to an image.");
  }
  try {
    await fetchy("/api/posts", "POST", {
      body: { text, images },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
  void router.push({ name: "Home" });
};

const emptyForm = () => {
  text.value = "";
  images.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(text, images)">
    <label for="text">post text:</label>
    <textarea id="text" v-model="text" placeholder="Insert text here"> </textarea>
    <label for="images">image:</label>
    <textarea id="images" v-model="images" placeholder="Insert link to image here (make sure it's publicly accessible!)"> </textarea>
    <button type="submit" class="pure-button-primary pure-button button">create</button>
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
  width: 60%;
  align-items: center;
}

label {
  margin-top: 0.25em;
  margin-bottom: 0.5em;
}
textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
  width: 95%;
  margin: 0 2.5%;
}

button {
  background-color: rgb(255, 208, 150);
  border: 1px solid #b5b7b9;
  color: black;
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  width: 20em;
  margin-top: 1em;
  margin-bottom: 0.75em;
}

button:hover {
  cursor: pointer;
  background-color: rgb(255, 237, 150);
}
</style>
