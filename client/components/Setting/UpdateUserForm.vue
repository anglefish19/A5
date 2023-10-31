<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let password = ref("");

const { updateUser, updateSession } = useUserStore();

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}
</script>

<template>
  -
  <h2>update user details</h2>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset>
      <legend>change your username</legend>
      <input type="text" placeholder="new username" v-model="username" required />
      <button type="submit" class="submit">update</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form">
    <fieldset>
      <legend>change your password</legend>
      <input type="password" placeholder="new password" v-model="password" required />
      <button type="submit" class="submit">update</button>
    </fieldset>
  </form>
</template>

<style scoped>
h2 {
  margin-top: 0.25em;
}
.submit {
  background-color: rgb(255, 208, 150);
  border: 1px solid #b5b7b9;
  margin-top: 1em;
  padding: 0.5em 1em;
  text-decoration: none;
  font-size: 1em;
}

.submit:hover {
  cursor: pointer;
  background-color: rgb(255, 237, 150);
}
</style>
