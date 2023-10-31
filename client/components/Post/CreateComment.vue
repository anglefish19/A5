<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const text = ref("");
const image = ref("");
const props = defineProps(["post"]);
const emit = defineEmits(["createComment", "refreshPosts"]);

const createComment = async (text: string, image: string) => {
  // https://stackoverflow.com/questions/55880196/is-there-a-way-to-easily-check-if-the-image-url-is-valid-or-not
  const res = await fetch(image);
  const buff = await res.blob();

  if (!buff.type.startsWith("image/")) {
    alert("Input for image is not a url that goes to an image.");
    throw Error("Input for image is not a url that goes to an image.");
  }
  try {
    await fetchy(`/api/posts/${props.post._id}/comments`, "POST", {
      body: { text, image },
    });
  } catch (_) {
    return;
  }
  emit("createComment");
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  text.value = "";
  image.value = "";
};
</script>

<template>
  <form @submit.prevent="createComment(text, image)">
    <div class="formContent">
      <h3 class="header">add comment</h3>
      <label for="text">comment text:</label>
      <textarea id="text" v-model="text" placeholder="Insert text here"> </textarea>
      <label for="image">image:</label>
      <textarea id="image" v-model="image" placeholder="Insert link to image here (make sure it's publicly accessible!)"> </textarea>
      <button type="submit" class="pure-button-primary pure-button">comment</button>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: justify;
  gap: 0.5em;
  padding: 1em;
  width: 90%;
  text-align: justify;
}

.formContent {
  display: flex;
  flex-direction: column;
  align-items: justify;
  gap: 0.5em;
  padding: 1em;
  width: 100%;
  text-align: justify;
  padding-left: 2.5%;
}

.header {
  margin-top: 0.25em;
}
textarea {
  font-family: inherit;
  font-size: inherit;
  height: 3em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
  width: 93%;
}

button {
  background-color: rgb(255, 208, 150);
  border: 1px solid #b5b7b9;
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  width: 20em;
  color: black;
  margin-top: 1em;
  margin-bottom: 0.25em;
}

button:hover {
  cursor: pointer;
  background-color: rgb(255, 237, 150);
}
</style>
