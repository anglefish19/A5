<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const username = ref("");
const props = defineProps(["tier"]);
const emit = defineEmits(["addItem", "refreshTiers"]);

const addItem = async (username: string) => {
  try {
    const user = (await fetchy(`/api/users/${username}`, "GET")).username;
    await fetchy(`/api/tiers/${props.tier._id}/${user}`, "PATCH", { body: { id: props.tier._id, item: user, fxn: "add" } });
  } catch (_) {
    return;
  }
  emit("addItem");
  emit("refreshTiers");
  emptyForm();
};

const emptyForm = () => {
  username.value = "";
};
</script>

<template>
  <form @submit.prevent="addItem(username)">
    <label for="username">Username:</label>
    <textarea id="username" v-model="username" placeholder="Input a username!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Add User!</button></li>
        <li><button class="btn-small pure-button" @click="emit('addItem')">Cancel</button></li>
      </menu>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
