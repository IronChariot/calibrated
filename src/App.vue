<!-- App.vue -->
<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<script setup>
import MainLayout from './components/MainLayout.vue';
import '@/assets/styles/main.css';
</script>

<style>
/* Global styles that affect the entire application */
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}
</style>