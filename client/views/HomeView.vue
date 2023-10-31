<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import CommentListComponent from "../components/Post/CommentListComponent.vue";
import FeedListComponent from "../components/Post/FeedListComponent.vue";
import PostComponent from "../components/Post/PostComponent.vue";
import { fetchy } from "../utils/fetchy";

const username = ref("");
let user = "";
let posts = ref<Array<Record<string, string>>>([]);
let searching = false;
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const search = async (username: string) => {
  let query: Record<string, string> = { author: username };
  let postResults;
  if (username === currentUsername.value) {
    alert("You cannot search for yourself. You can, however, view your posts by clicking your username in the top left corner.");
    return;
  }
  try {
    await fetchy(`/api/users/${username}`, "GET");
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  posts.value = postResults;
  searching = true;
  user = username;
  emptyForm();
};

const emptyForm = () => {
  username.value = "";
};
</script>

<template>
  <main>
    <div class="center" v-if="!isLoggedIn">
      <img src="@/assets/images/loop.png" />
    </div>
    <div class="row center" v-if="!isLoggedIn">
      <ul>
        <li>
          <RouterLink to="/register" class="button"> register </RouterLink>
        </li>
      </ul>
      <ul>
        <li>
          <RouterLink to="/login" class="button"> log in </RouterLink>
        </li>
      </ul>
    </div>
    <div class="center" v-if="isLoggedIn">
      <form @submit.prevent="search(username)">
        <ul class="searchComponent">
          <textarea id="username" v-model="username" placeholder="search for posts by username of the creator!"> </textarea>
          <button type="submit">
            <img class="search" src="@/assets/images/search.png" />
          </button>
        </ul>
      </form>
    </div>
    <div class="center" v-if="searching">
      <div class="username">
        {{ user }}
      </div>
      <section class="posts" v-if="posts.length !== 0">
        <div class="infoScent">number of posts: {{ posts.length }}</div>
      </section>
      <p v-else>{{ user }} has yet to make any posts.</p>
      <section class="posts" v-if="posts.length !== 0">
        <article v-for="post in posts" :key="post._id">
          <PostComponent :post="post" />
          <CommentListComponent :post="post" />
        </article>
      </section>
    </div>
    <FeedListComponent class="center" v-if="isLoggedIn && !searching" />
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
  margin: auto;
  border-radius: 1em;
  border: 1px solid #b5b7b9;
  background-color: #f9f9f9;
}

img {
  height: 35em;
}

.searchComponent {
  margin-top: 2em;
  margin-bottom: 2em;
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

.addFriend {
  font-size: 1.5em;
  margin-top: 0.5em;
  padding: 0.25em 0.5em;
  margin-bottom: 2em;
}

.username {
  font-size: 2em;
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
