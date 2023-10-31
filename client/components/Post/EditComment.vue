<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post", "comment"]);
const text = ref(props.post.text);
const image = ref(props.post.image);
const emit = defineEmits(["editComment", "refreshComments"]);

const editComment = async (text: string, image: string) => {
  // https://stackoverflow.com/questions/55880196/is-there-a-way-to-easily-check-if-the-image-url-is-valid-or-not
  const res = await fetch(image);
  const buff = await res.blob();

  if (!buff.type.startsWith("image/")) {
    alert("Input for image is not a url that goes to an image.");
    throw Error("Input for image is not a url that goes to an image.");
  }
  try {
    await fetchy(`/api/posts/${props.post._id}/comments/${props.comment._id}`, "PATCH", { body: { update: { text: text, image: image } } });
  } catch (e) {
    return;
  }
  emit("editComment");
  emit("refreshComments");
};
</script>

<template>
  <form @submit.prevent="editComment(text, image)">
    <p class="author">{{ props.comment.author }}</p>
    <textarea id="text" v-model="text" placeholder="Insert text here"> </textarea>
    <textarea id="image" v-model="image" placeholder="Insert link to image here (make sure it's publicly accessible!)"> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button orange" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editComment')">Cancel</button></li>
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
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 3em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.orange {
  background-color: rgb(255, 208, 150);
  color: black;
}
</style>
