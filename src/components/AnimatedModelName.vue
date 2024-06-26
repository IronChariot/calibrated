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
import { ref, watchEffect, nextTick, defineProps } from 'vue';

const props = defineProps({
  models: Array
});

const currentModelName = ref('GPT-4o'); // Default value so we don't have a blank while waiting for database values
const isActive = ref(false);
const wrapperWidth = ref('auto');
let modelNameElement = null;
let randomModels = [];

watchEffect(() => {
  const models = props.models;
  // Make a deep copy of the models array so we can randomize it without modifying the original array
  randomModels = JSON.parse(JSON.stringify(models));
  if (randomModels.length === 0) return;
  
  let index = 0;
  randomModels.sort(() => 0.5 - Math.random());

  const cycleModelNames = async () => {
    isActive.value = false;
    currentModelName.value = randomModels[index].model_nice_name;
    await nextTick();
    modelNameElement = modelNameElement || document.querySelector('.model-name');
    wrapperWidth.value = `${modelNameElement.offsetWidth}px`;
    
    isActive.value = true;

    await new Promise(resolve => setTimeout(resolve, 2700));
    index = (index + 1) % randomModels.length;
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
  height: 20vh;
  flex-wrap: wrap;
}

.title-line {
  font-size: 0.8em;
  line-height: 1em;
  display: block; /* Ensures lines stack on smaller screens */
  text-align: center;
}

@media (min-width: 1300px) {
  .title-line {
    display: inline;
  }
  .title-wrapper {
    flex-direction: row;
    flex-wrap: nowrap; /* Prevents wrapping on larger screens */
  }
  .active {
    animation: floatFade 3s ease-in-out;
  }
}

@media (max-width: 1299px) {
  .active {
    animation: floatFadeSmall 3s ease-in-out;
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

@keyframes floatFade {
  0% {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  25%, 75% {
    transform: translateX(-50%) translateY(-11%);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
}

@keyframes floatFadeSmall {
  0% {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  25%, 75% {
    transform: translateX(-50%) translateY(3%);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
}
</style>