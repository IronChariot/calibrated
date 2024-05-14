<!-- src/components/HomePage.vue -->
<template>
  <div>
    <AnimatedModelName :models="models" />
    <div class="content-section">
      <div class="text-column">
        <p>We know large language models aren't perfect. They hallucinate, contradict themselves, and can't yet reason to the level we'd hope from something called 'AI'. But they get some things right some of the time, and the more advanced models obviously get things right more often than weaker models. This website is set up to help people get a sense of how well calibrated they are when it comes to judging which questions large language models will get right or wrong. Have a go and see how you do!</p>
        <p>Select one or more of the models below and click 'Start'. You will be shown a question or prompt exactly as it was given to the model, alongside a slider to select your guess of the chance that the model will answer correctly on the first try with a temperature of 1.0.</p>
        <p>After at least 10 questions, you will be able to check how good your level of calibration is, or you can continue answering to get a more accurate measure.</p>
        <transition name="fade">
          <div class="select-and-button" v-if="models.length > 0">
            <ul class="model-list">
              <li v-for="model in models" :key="model.id" class="model-item">
                <input type="checkbox" :id="model.id" :value="model.id" v-model="selectedModels">
                <label :for="model.id">{{ model.model_nice_name }}</label>
              </li>
            </ul>
            <button :disabled="selectedModels.length === 0" @click="startQuiz">Start</button>
          </div>
        </transition>
      </div>
      <div class="image-column">
        <div class="image-container">
          <img src="@/assets/example-graph.png" alt="Calibration graph" />
          <p class="image-caption">Being well calibrated can help you make better decisions about when to use LLMs, which LLMs to use or when to use higher effort prompts for a particular task</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AnimatedModelName from './AnimatedModelName.vue';
import { fetchModels } from '../api';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();
const models = ref([]);
const selectedModels = ref([]);

onMounted(async () => {
  models.value = await fetchModels();
  models.value.sort((a, b) => a.order - b.order);
});

function startQuiz() {
  if (selectedModels.value.length > 0) {
    // Reset or clear cookies here before starting a new quiz
    store.dispatch('reset');

    // From the selected model ids, set the models in the store
    const fullSelectedModels = models.value.filter(model => selectedModels.value.includes(model.id));
    store.dispatch('setModels', fullSelectedModels)
    router.push({ name: 'QuestionPage' });
  }
}
</script>

<style scoped>
.model-list {
  padding: 0;
  list-style: none;
}

.model-item {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.model-item input[type="checkbox"] {
  margin-right: 10px; /* Space between the checkbox and label */
}

.content-section {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.text-column {
  flex: 1;
  padding-right: 100px;
  padding-left: 200px;
  max-width: 500px;
  min-width: 500px;
  text-align: justify;
}

.image-column {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 200px;
  min-width: 500px;
}

button {
    margin-left: 30px;
}

.select-and-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

@media (max-width: 1300px) {
  .content-section {
    flex-direction: column;
    align-items: center;
  }

  .text-column, .image-column {
    max-width: 500px;
    min-width: 300px;
    width: 90%;
    padding: 0;
    margin: 0 auto;
  }
}

.image-caption {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: 10px;
  max-width: 800px;
}

.dark-mode .image-caption {
  color: #ccc;
}
</style>