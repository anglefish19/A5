<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const url = props.post.images;
const username = ref("");
const image = ref<HTMLImageElement>();
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

onMounted(async () => {
  image.value?.setAttribute("src", url);
});
</script>

<template>
  <div class="post">
    <p class="author">{{ props.post.author }}</p>
    <img v-if="url" class="image" ref="image" src="" alt="broken image url" />
    <p class="postText">{{ props.post.text }}</p>
    <div class="base alignment">
      <menu v-if="props.post.author == currentUsername">
        <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.post {
  background-color: var(--base-bg);
  border-radius: 1em;
  margin-bottom: 1em;
  padding: 2em;
  max-width: 60em;
}

p {
  margin: 0.5em;
}

.image {
  max-width: 100%;
}

.author {
  font-weight: 600;
  font-size: 1.2em;
  margin-top: 0;
  margin-bottom: 1em;
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
</style>
