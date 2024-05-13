<!-- src/components/MainLayout.vue -->
<template>
  <div>
    <header class="header">
      <router-link to="/" v-if="!isOnHomePage" class="home-button">
        <font-awesome-icon :icon="['fas', 'house']" />
      </router-link>
      <DarkModeToggle @toggle="toggleDarkMode" :isDark="isDark" />
    </header>
    <slot />
    <!-- You may uncomment the footer if needed for future use -->
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import DarkModeToggle from "@/components/DarkModeToggle.vue";

library.add(faHome);

const route = useRoute();
const isDark = ref(window.matchMedia("(prefers-color-scheme: dark)").matches);

// This computed property will return true if the current route is not the home page
const isOnHomePage = computed(() => route.path === "/");

if (isDark.value) {
  document.body.classList.add('dark-mode');
}

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
};

watch(isDark, (newValue) => {
  if (newValue) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});
</script>

<style scoped>
.header {
  position: relative;
}
.home-button {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 1000;
}
.home-button:visited {
  color: #000; /* Same color as the unvisited link */
}
.dark-mode .home-button:visited {
  color: #fff; /* Same color as the unvisited link */
}
.dark-mode {
  background-color: #333;
  color: #fff;
}
</style>