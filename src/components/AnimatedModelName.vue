<template>
  <div class="title-wrapper">
    <h1 class="title">Do you know how often <span class="model-name-wrapper" :style="{ width: wrapperWidth }"><span class="model-name" :class="{active: isActive}">{{ currentModelName }}</span></span> gets things right?</h1>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { fetchModels } from '../api';

const currentModelName = ref('');
const isActive = ref(false);
const wrapperWidth = ref('auto');

onMounted(async () => {
  const models = await fetchModels();
  // Randomise the order of the models
  models.sort(() => 0.5 - Math.random());
  let index = 0;
  let modelNameElement = null;
  
  const cycleModelNames = async () => {
    isActive.value = false;
    currentModelName.value = models[index].model_nice_name;
    await nextTick();
    // Ensure we measure the new text width
    modelNameElement = modelNameElement || document.querySelector('.model-name');
    wrapperWidth.value = `${modelNameElement.offsetWidth}px`;

    isActive.value = true;

    await new Promise(resolve => setTimeout(resolve, 2700)); // Wait for the fade-in animation to complete
    index = (index + 1) % models.length;
    cycleModelNames();
  };

  cycleModelNames();
});
</script>

<style scoped>
.title-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh;
}

.title {
  /* Title should use very large font */
  font-size: 3em;
}

@keyframes floatFade {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  25%, 75% {
    transform: translateY(-10%);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
}
.model-name-wrapper {
  display: inline-block;
  min-height: 1em;
  position: relative;
  vertical-align: bottom;
  overflow: hidden;
  transition: width 0.5s ease-in-out;
}

.model-name {
  position: absolute;
  white-space: nowrap;
}

.active {
  animation: floatFade 3s ease-in-out;
}
</style>