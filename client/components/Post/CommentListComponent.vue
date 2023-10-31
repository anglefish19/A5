<script setup lang="ts">
import CommentComponent from "@/components/Post/CommentComponent.vue";
import CreateComment from "@/components/Post/CreateComment.vue";
import EditComment from "@/components/Post/EditComment.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
const props = defineProps(["post"]);
const emit = defineEmits(["refreshPosts"]);
let comments = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getComments() {
  try {
    comments.value = await fetchy(`/api/posts/${props.post._id}/comments`, "GET");
  } catch (_) {
    return;
  }
  emit("refreshPosts");
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getComments();
  loaded.value = true;
});
</script>

<template>
  <section v-if="loaded && comments.length !== 0">
    <article v-for="comment in comments" :key="comment._id">
      <CommentComponent v-if="editing !== comment._id" :comment="comment" post="props.post" @refreshComments="getComments" @editComment="updateEditing" />
      <EditComment v-else :comment="comment" post="props.post" @refreshComments="getComments" @editComment="updateEditing" />
    </article>
    <CreateComment class="commentForm" :post="props.post" @refreshComments="getComments" @editComment="updateEditing" />
  </section>
  <section v-else-if="loaded">
    <CreateComment class="commentForm" :post="props.post" @refreshComments="getComments" @editComment="updateEditing" />
  </section>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  width: 50em;
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  text-align: justify;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

.commentForm {
  width: 50em;
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  text-align: justify;
}

button {
  background-color: rgb(255, 208, 150);
  border: 1px solid #b5b7b9;
  border-radius: 1em;
  padding: 0.25em 0.5em;
  width: 20em;
}

button:hover {
  cursor: pointer;
  background-color: rgb(255, 237, 150);
}
</style>
