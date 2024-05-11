<template>
  <div class="title-wrapper">
    <h1 class="title">
      <p class="title-line">How good are you at predicting </p>
      <p class="title-line">when 
      <span class="model-name-wrapper" :style="{ width: wrapperWidth }">
        <span class="model-name" :class="{ active: isActive }">{{ currentModelName }}</span>
      </span>
      will </p>
      <p class="title-line"> get a question right?</p>
    </h1>
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
  models.sort(() => 0.5 - Math.random());
  let index = 0;
  let modelNameElement = null;

  const cycleModelNames = async () => {
    isActive.value = false;
    currentModelName.value = models[index].model_nice_name;
    await nextTick();
    modelNameElement = modelNameElement || document.querySelector('.model-name');
    wrapperWidth.value = `${modelNameElement.offsetWidth}px`;

    isActive.value = true;

    await new Promise(resolve => setTimeout(resolve, 2700));
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
  flex-wrap: wrap; /* Allows content to wrap as needed */
}

.title-line {
  font-size: 1em;
  /* Adjust text alignment and line height as before */
  line-height: 1em;
  display: block; /* Ensures lines stack on smaller screens */
  text-align: center;
}

@media (min-width: 1300px) {
  .title-line {
    display: inline; /* Lines flow in a row on larger screens */
  }
  .title-wrapper {
    flex-direction: row;
    flex-wrap: nowrap; /* Prevents wrapping on larger screens */
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

  /* Center the element horizontally */
  left: 50%;
  transform: translateX(-50%);
}

.active {
  animation: floatFade 3s ease-in-out;
}

@keyframes floatFade {
  0% {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  25%, 75% {
    transform: translateX(-50%) translateY(-5%);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
}
</style>