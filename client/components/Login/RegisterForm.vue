<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>R E G I S T E R</h3>
    <fieldset>
      <label for="aligned-name">Username</label>
      <div class="pure-control-group">
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <label for="aligned-password">Password</label>
      <div class="pure-control-group">
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="center">
        <button type="submit" class="submit">register</button>
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
