<script setup lang="ts">
import router from "@/router";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { logoutUser } = useUserStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { toast } = storeToRefs(useToastStore());

async function logout() {
  try {
    await logoutUser();
    await userStore.updateSession();
  } catch (_) {
    return;
  }
  void router.push({ name: "Home" });
}

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav v-if="isLoggedIn">
      <div class="title">
        <RouterLink :to="{ name: 'Home' }" onclick="location.reload()">
          <img src="@/assets/images/loop.png" />
        </RouterLink>
        <RouterLink :to="{ name: 'User' }">
          <div class="username">
            {{ currentUsername }}
          </div>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }">
            <div class="link">Feed</div>
          </RouterLink>
        </li>
        <!-- <li>
          <RouterLink :to="{ name: 'Friends' }" :class="{ underline: currentRouteName == 'Friends' }">
            <div class="link">Friends</div>
          </RouterLink>
        </li> -->
        <li>
          <RouterLink :to="{ name: 'Tiers' }" :class="{ underline: currentRouteName == 'Tiers' }">
            <div class="link">Tiers</div>
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }">
            <div class="link">Settings</div>
          </RouterLink>
        </li>
        <li>
          <div class="link" @click="logout">Logout</div>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <div v-if="currentRouteName !== 'Create' && isLoggedIn" class="corner">
    <RouterLink :to="{ name: 'Create' }" onclick="location.reload()">
      <img class="icon" src="@/assets/images/create.png" />
    </RouterLink>
  </div>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

.corner {
  position: fixed;
  bottom: 0.75em;
  right: 0.5em;
}

.icon {
  height: 6em;
}

nav {
  padding: 0em 1.5em;
  background-color: rgba(255, 208, 150, 0.268);
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 8em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}

.username {
  font-weight: 500;
  font-size: 2em;
  margin-left: 0.5em;
}

.link {
  font-size: 1.4em;
  margin-right: 0.5em;
}

.link:hover {
  cursor: pointer;
}
</style>
