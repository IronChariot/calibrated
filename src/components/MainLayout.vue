// MainLayout.vue
<template>
  <div :class="{ 'dark-mode': isDark }">
    <header>
      <DarkModeToggle />
    </header>
    <slot />
    <footer>
      <CoffeeLink />
    </footer>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const isDark = ref(window.matchMedia("(prefers-color-scheme: dark)").matches);
</script>