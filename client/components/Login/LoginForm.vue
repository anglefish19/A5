<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();

async function login() {
  try {
    await loginUser(username.value, password.value);
  } catch (_) {
    return;
  }
  void updateSession();
  void router.push({ name: "Home" });
  await fetchy(`/api/feed`, "POST");
  location.reload();
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="login">
    <h3>L O G I N</h3>
    <fieldset>
      <label for="aligned-name">username</label>
      <div class="pure-control-group">
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="username" required />
      </div>
      <label for="aligned-password">password</label>
      <div class="pure-control-group">
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="password" required />
      </div>
      <div class="center">
        <button type="submit" class="submit">submit</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
  margin-top: 1em;
  margin-bottom: 0.75em;
  font-size: 3em;
}

label {
  font-size: 1.4em;
}
input {
  text-align: center;
  margin-top: 0.5em;
  margin-bottom: 2em;
  font-size: 1.25em;
}
.submit {
  background-color: rgb(255, 208, 150);
  border: 1px solid #b5b7b9;
  margin-top: 1em;
  padding: 0.5em 1em;
  text-decoration: none;
  font-size: 1.25em;
}

.submit:hover {
  cursor: pointer;
  background-color: rgb(255, 237, 150);
}
</style>
