<!-- src/components/DarkModeToggle.vue -->
<template>
    <div class="toggle-container" @click="toggle">
      <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" />
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from "vue";
  import { library } from "@fortawesome/fontawesome-svg-core";
  import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  
  library.add(faSun, faMoon);
  
  defineProps({
    isDark: Boolean
  });
  const emit = defineEmits(["toggle"]);
  
  const toggle = () => {
    emit("toggle");
  };
  </script>
  
  <style scoped>
  .toggle-container {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 1000;
  }
  </style>