<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
</script>

<template>
  <nav>
    <RouterLink :to="{ name: 'Home' }">
      <img src="@/assets/images/loop.png" />
    </RouterLink>
  </nav>
  <main class="column center">
    <LoginForm />
  </main>
</template>

<style scoped>
nav {
  padding: 0em 1.5em;
  background-color: rgba(255, 208, 150, 0.268);
  display: flex;
  align-items: center;
}

img {
  height: 8em;
}

.center {
  text-align: center;
}
</style>
