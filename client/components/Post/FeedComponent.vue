<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import CommentListComponent from "./CommentListComponent.vue";

const props = defineProps(["feed"]);
</script>

<template>
  <section class="posts" v-if="props.feed.content.length !== 0">
    <article v-for="post in props.feed.content" :key="post._id">
      <PostComponent :post="post" />
      <CommentListComponent :post="post" />
    </article>
  </section>
  <p v-else>No posts found</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  border-radius: 1em;
  border: 1px solid #b5b7b9;
  background-color: #f9f9f9;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  margin-bottom: 2em;
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
</style>
