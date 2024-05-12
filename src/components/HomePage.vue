<template>
  <div>
    <AnimatedModelName :models="models" />
    <div class="content-section">
      <div class="text-column">
        <p>We know large language models aren't perfect. They hallucinate, contradict themselves, and can't yet reason to the level we'd hope from something called 'AI'. But they get some things right some of the time, and the more advanced models obviously get things right more often than weaker models. This website is set up to help people get a sense of how well calibrated they are when it comes to judging which questions large language models will get right or wrong. Have a go and see how you do!</p>
        <p>Select one or more of the models below and click 'Start'. You will be shown a question or prompt exactly as it was given to the model, alongside a slider to select your guess of how often the model gets the answer right when its temperature is set to 1.0, a common setup when using Large Language Models as chatbots.</p>
        <p>After at least 10 questions, you will be able to check how good your level of calibration is, or you can continue answering to get more accurate measure.</p>
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
          <p class="image-caption">Being well calibrated can help you make better decisions about when to use LLMs, or help you know when higher quality prompts will be needed for a particular task</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AnimatedModelName from './AnimatedModelName.vue';
import { fetchModels } from '../api';
const models = ref([]);
const selectedModels = ref([]);

onMounted(async () => {
  models.value = await fetchModels();
});

function startQuiz() {
  if (selectedModels.value.length > 0) {
    console.log("Starting quiz with models:", selectedModels.value);
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

/* Add styles to make disabled button obvious */
button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: #ccc;
}

.content-section {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.text-column {
  flex: 1; /* This assigns an equal amount of space to both columns */
  padding-right: 100px; /* Adds some spacing between the text and the image */
  padding-left: 200px;
  max-width: 500px;
  min-width: 500px;
  text-align: justify;
}

.image-column {
  flex: 1;
  display: flex;
  justify-content: center; /* Centers the image horizontally */
  align-items: center; /* Centers the image vertically */
  padding-right: 200px;
  min-width: 500px;
}

img {
  max-width: 100%; /* Ensures the image is responsive and does not overflow its container */
  height: auto; /* Keeps the image aspect ratio */
}

select, button {
  font-size: 1.2rem; /* Increase font size */
  padding: 10px 20px; /* Add padding for better touch area and visibility */
  margin-top: 10px; /* Spacing from other elements */
  border: 2px solid #ccc; /* Stylish border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
}

button {
  margin-left: 30px;
  height: 45px;
  background-color: #4CAF50; /* A nice shade of green */
  color: white;
  border: none; /* Remove border for the button for a cleaner look */
}

button:hover {
  background-color: #45a049; /* Slightly darker green on hover */
}

.select-and-button {
  /* Center align the entire div */
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
    align-items: center; /* Center alignment for the new columnar layout */
  }

  .text-column, .image-column {
    max-width: 500px;
    min-width: 300px;  /* Optionally adjust for narrower screens */
    width: 90%;        /* Adjust if a percentage width is more responsive */
    padding: 0;
    margin: 0 auto;    /* Center the columns */
  }
}

.image-caption {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: 10px;
}
</style>