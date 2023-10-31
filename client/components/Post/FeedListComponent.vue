<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import FeedComponent from "./FeedComponent.vue";

const loaded = ref(false);
let feeds = ref<Array<Record<string, string>>>([]);

async function getFeeds() {
  let feedResults;
  try {
    feedResults = await fetchy("/api/feed", "GET");
  } catch (_) {
    return;
  }
  feeds.value = feedResults;
}

onBeforeMount(async () => {
  await getFeeds();
  loaded.value = true;
});
</script>

<template>
  <section class="feeds" v-if="loaded && feeds.length !== 0">
    <article v-for="feed in feeds" :key="feed._id">
      <FeedComponent :feed="feed" @refreshFeeds="getFeeds" />
    </article>
  </section>
  <p v-else-if="loaded">No posts to display; try finding people you'd want to add to your tier lists using the search bar!</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

p {
  margin-top: 2em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
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
