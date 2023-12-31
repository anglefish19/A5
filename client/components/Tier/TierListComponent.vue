<script setup lang="ts">
import AddItemForm from "@/components/Tier/AddItemForm.vue";
import CreateTierForm from "@/components/Tier/CreateTierForm.vue";
import EditTierForm from "@/components/Tier/EditTierForm.vue";
import TierComponent from "@/components/Tier/TierComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let tiers = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let adding = ref("");

async function getTiers() {
  try {
    tiers.value = await fetchy("/api/tiers", "GET", {});
  } catch (_) {
    return;
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

function updateAdding(id: string) {
  adding.value = id;
}

onBeforeMount(async () => {
  await getTiers();
  loaded.value = true;
});
</script>

<template>
  <section class="tiers" v-if="loaded && tiers.length !== 0">
    <article v-for="tier in tiers" :key="tier._id">
      <TierComponent v-if="editing !== tier._id && adding != tier._id" :tier="tier" @refreshTiers="getTiers" @editTier="updateEditing" @addItem="updateAdding" />
      <EditTierForm v-else-if="editing === tier._id" :tier="tier" @refreshTiers="getTiers" @editTier="updateEditing" @addItem="updateAdding" />
      <AddItemForm v-else :tier="tier" @refreshTiers="getTiers" @editTier="updateEditing" @addItem="updateAdding" />
    </article>
  </section>
  <p v-else-if="loaded">You have yet to create a tier.</p>
  <p v-else>Loading...</p>
  -
  <section v-if="isLoggedIn">
    <h2>create a tier:</h2>
    <CreateTierForm @refreshTiers="getTiers" />
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  text-align: center;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

h2 {
  margin-top: 0em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  border: 1px solid #b5b7b9;
  margin-top: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
