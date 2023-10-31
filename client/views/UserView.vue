<script setup lang="ts">
import CommentListComponent from "@/components/Post/CommentListComponent.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
const image = ref<HTMLImageElement>();
const loaded = ref(false);
const { currentUsername } = storeToRefs(useUserStore());

const getPosts = async () => {
  let query: Record<string, string> = { author: currentUsername.value };
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  posts.value = postResults;
};

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <main>
    <div class="center">
      <div class="username">
        {{ currentUsername }}
      </div>
      <section class="posts" v-if="loaded && posts.length !== 0">
        <div class="infoScent">number of posts: {{ posts.length }}</div>
        <article v-for="post in posts" :key="post._id">
          <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
          <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
          <CommentListComponent :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        </article>
      </section>
      <p v-else-if="loaded">You have yet to make any posts.</p>
      <p v-else>Loading...</p>
    </div>
  </main>
</template>

<style scoped>
main {
  display: block;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 2em;
}

article {
  width: 60%;
  margin: 0.5em auto;
  border-radius: 1em;
  border: 1px solid #b5b7b9;
  background-color: #f9f9f9;
  margin-top: 2em;
}

img {
  height: 35em;
}
.searchComponent {
  margin-top: 2em;
}

textarea {
  margin-left: 22em;
  width: 40em;
  padding-top: 1em;
  padding-bottom: 0;
  padding-left: 1em;
}

.search {
  height: 3em;
}

.username {
  font-size: 2em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.25em;
}

.infoScent {
  font-size: 1em;
  margin-bottom: 2em;
}

button {
  background-color: rgb(255, 208, 150);
  border: 1px solid #b5b7b9;
}

button:hover {
  cursor: pointer;
  background-color: rgb(255, 237, 150);
}

.center {
  text-align: center;
}
.row {
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  max-width: 40em;
}

ul {
  list-style-type: none;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-right: 2.5em;
}
</style>
