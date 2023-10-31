<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

let requests = ref<Array<Record<string, string>>>([]);
let friends = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);
const { currentUsername } = storeToRefs(useUserStore());

const getFriends = async () => {
  try {
    friends.value = await fetchy("/api/friends", "GET");
  } catch (_) {
    return;
  }
};

const getRequests = async () => {
  try {
    requests.value = await fetchy("/api/friend/requests", "GET");
  } catch (_) {
    return;
  }
};

onBeforeMount(async () => {
  await getRequests();
  await getFriends();
  loaded.value = true;
});
</script>

<template>
  <main>
    <div class="center">
      <div class="header">friend requests</div>
      <section class="requests" v-if="loaded && requests.length !== 0">
        <div class="infoScent">number of requests: {{ requests.length }}</div>
        <article v-for="request in requests" :key="request._id">
          {{ request }}
        </article>
      </section>
      <p v-else-if="loaded">You have no pending friend requests.</p>
      <p v-else>Loading...</p>
      <div class="spacer">-</div>
      <div class="header">friends of {{ currentUsername }}</div>
      <section class="friends" v-if="loaded && friends.length !== 0">
        <div class="infoScent">number of friends: {{ friends.length }}</div>
        <article v-for="friend in friends" :key="friend._id">
          {{ friend }}
        </article>
      </section>
      <p v-else-if="loaded">You have yet to befriend anyone on Loop.</p>
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
  margin: auto;
  border-radius: 1em;
  border: 1px solid #b5b7b9;
  background-color: #f9f9f9;
}

img {
  height: 35em;
}

.spacer {
  margin-top: 3em;
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

.header {
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
