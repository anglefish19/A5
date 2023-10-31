<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <h1>settings for {{ currentUsername }}</h1>
    <UpdateUserForm />
    -
    <button class="button-error pure-button" @click="delete_">Delete User</button>
  </main>
</template>

<style scoped>
h1,
button {
  margin-top: 1em;
  margin-bottom: 0.25em;
}
</style>
