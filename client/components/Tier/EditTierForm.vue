<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["tier"]);
const name = ref(props.tier.name);
const priority = ref(props.tier.priority);
const emit = defineEmits(["editTier", "refreshTiers"]);

const editTier = async (name: string, priority: string) => {
  try {
    await fetchy(`/api/tiers/${props.tier._id}`, "PATCH", { body: { update: { name: name, priority: priority } } });
  } catch (e) {
    return;
  }
  emit("editTier");
  emit("refreshTiers");
};
</script>

<template>
  <form @submit.prevent="editTier(name, priority)">
    <textarea id="name" v-model="name" placeholder="Enter a new name!" required> </textarea>
    <textarea id="priority" v-model="priority" placeholder="Enter a number that corresponds to the importance of the tier!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editTier')">Cancel</button></li>
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
