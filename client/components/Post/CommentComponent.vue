<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post", "comment"]);
const url = props.comment.image;
const image = ref<HTMLImageElement>();
const emit = defineEmits(["editComment", "refreshComments"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteComment = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}/comments/${props.comment._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshComments");
};

onMounted(() => {
  image.value?.setAttribute("src", url);
});
</script>

<template>
  <div class="comment">
    <p class="author">{{ props.comment.author }}</p>
    <img v-if="url" ref="image" src="" alt="broken image url" />
    <p class="text">{{ props.comment.text }}</p>
    <div class="base">
      <menu v-if="props.comment.author == currentUsername">
        <li><button class="btn-small pure-button" @click="emit('editComment', props.comment._id)">Edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deleteComment">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.comment.dateCreated !== props.comment.dateUpdated">Edited on: {{ formatDate(props.comment.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.comment.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0.5em 0;
}

img {
  max-width: 100%;
}

.text {
  inline-size: 100%;
  overflow-wrap: break-word;
}

.comment {
  padding-left: 2.5%;
  padding-right: 2.5%;
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

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
