<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["tier"]);
const emit = defineEmits(["editTier", "refreshTiers"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteTier = async () => {
  try {
    await fetchy(`/api/tiers/${props.tier._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshTiers");
};

const addItem = async (item: string) => {
  try {
    await fetchy(`/api/tiers/${props.tier._id}/${item}`, "PATCH", { body: { id: props.tier._id, item: item, fxn: "add" } });
  } catch {
    return;
  }
  emit("refreshTiers");
};

const deleteItem = async (item: string) => {
  try {
    await fetchy(`/api/tiers/${props.tier._id}/${item}`, "PATCH", { body: { id: props.tier._id, item: item, fxn: "delete" } });
  } catch {
    return;
  }
  emit("refreshTiers");
};
</script>

<template>
  <p class="name">{{ props.tier.name }} - priority {{ props.tier.priority }}</p>
  <section class="items" v-if="loaded">
    <article v-for="item in props.tier.items" :key="item._id">
      <li><button class="button-error btn-small pure-button" @click="deleteItem(item)">Delete Item</button></li>
    </article>
  </section>
  <div class="base">
    <menu>
      <li><button class="btn-small pure-button" @click="addItem">Add Item</button></li>
      <li><button class="btn-small pure-button" @click="emit('editTier', props.tier._id)">Edit Tier Name/Priority</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteTier">Delete</button></li>
    </menu>
  </div>
</template>

<style scoped>
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

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
