// src/composables/useDarkMode.js
import { ref, watchEffect } from 'vue';

const isDark = ref(false);

if (typeof window !== 'undefined' && window.matchMedia) {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
}

watchEffect(() => {
  const className = 'dark-mode';
  if (isDark.value) {
    document.body.classList.add(className);
  } else {
    document.body.classList.remove(className);
  }
});

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
};

export function useDarkMode() {
  return {
    isDark,
    toggleDarkMode
  };
}