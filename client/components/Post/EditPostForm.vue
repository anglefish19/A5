<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const text = ref(props.post.text);
const image = ref(props.post.images);
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (text: string, image: string) => {
  // https://stackoverflow.com/questions/55880196/is-there-a-way-to-easily-check-if-the-image-url-is-valid-or-not
  const res = await fetch(image);
  const buff = await res.blob();

  if (!buff.type.startsWith("image/")) {
    alert("Input for image is not a url that goes to an image.");
    throw Error("Input for image is not a url that goes to an image.");
  }
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { update: { text: text, images: image } } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost(text, image)">
    <p class="author">{{ props.post.author }}</p>
    <label for="text">post text:</label>
    <textarea id="text" v-model="text" placeholder="Insert text here"> </textarea>
    <label for="image">image:</label>
    <textarea id="image" v-model="image" placeholder="Insert link to image here (make sure it's publicly accessible!)"> </textarea>
    <div class="base alignment">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button orange" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: center;
  border-radius: 1em;
  margin-bottom: 1em;
  padding: 2em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  width: 80%;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0.5em;
}

.author {
  font-weight: 600;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 10em;
  padding: 0;
  margin: 1em 0;
  margin-top: 2em;
}

.timestamp {
  display: flex;
  justify-content: center;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: block;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
.alignment {
  text-align: justify;
}

.orange {
  background-color: rgb(255, 208, 150);
  color: black;
}
</style>
