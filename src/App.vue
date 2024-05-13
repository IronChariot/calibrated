<!-- App.vue -->
<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<script setup>
// Import any global styles, utilities, or setup functions here
import MainLayout from './components/MainLayout.vue';
import '@/assets/styles/main.css'; // Example global style import
</script>

<style>
/* Global styles that affect the entire application */
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}
</style>