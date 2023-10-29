<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const priority = ref("");
const emit = defineEmits(["refreshTiers"]);

const createTier = async (name: string, priority: string) => {
  try {
    await fetchy("/api/tiers", "POST", {
      body: { name, priority },
    });
  } catch (_) {
    return;
  }
  emit("refreshTiers");
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
  priority.value = "";
};
</script>

<template>
  <form @submit.prevent="createTier(name, priority)">
    <label for="name">Name:</label>
    <textarea id="name" v-model="name" placeholder="Enter a name for your tier!" required> </textarea>
    <label for="priority">Priority:</label>
    <textarea
      id="priority"
      v-model="priority"
      placeholder="Enter a positive integer that represents the importance of your tier! Priority goes from least to greatest (1 has higher priority than 2)."
      required
    >
    </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Tier</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
