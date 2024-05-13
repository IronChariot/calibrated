<!-- src\components\QuestionPage.vue -->
<template>
  <div class="question-page">
    <transition name="slide">
      <div v-if="currentQuestion" :key="currentQuestion" class="question-content">
        <!-- Updated title section -->
        <div class="question-title">
          <h2>Question {{ currentQuestionIndex + 1 }}</h2>
          <h3>({{ currentQuestion.category }})</h3>
        </div>
        
        <!-- Container for question and guidance -->
        <div class="question-guidance-container">
          <div class="question-box-container">
            <label class="box-label">Exact Prompt:</label>
            <div class="question-box">{{ currentQuestion.question_text }}</div>
          </div>
          <div class="guidance-box-container">
            <label class="box-label">Answer Guidance:</label>
            <div class="guidance-box">{{ currentQuestion.answer_guidance }}</div>
          </div>
        </div>
        
        <!-- Slider section with model label and percentage display -->
        <div v-for="model in selectedModels" :key="model.id" class="slider-container">
          <label>{{ model.model_nice_name }}</label>
          <input type="range" min="0" max="100" v-model="answers[model.id]" class="slider" />
          <span class="percent-label">{{ answers[model.id] }}%</span>
        </div>

        <!-- Navigation buttons -->
        <button v-if="currentQuestionIndex < questions.length - 1" @click="nextQuestion" class="next-question-button">Next Question</button>
        <button v-if="answeredQuestions.length >= 10" @click="checkResults" class="check-results-button">Check Calibration Results</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const selectedModels = computed(() => store.state.selectedModels);
const questions = computed(() => store.state.questions);
const currentQuestionIndex = computed(() => store.state.currentQuestionIndex);
const currentQuestion = computed(() => store.state.questions[store.state.currentQuestionIndex]);
const answeredQuestions = computed(() => store.state.answeredQuestions);

const answers = ref({});

onMounted(async () => {
  if (store.state.questions.length === 0) {
    await store.dispatch('fetchAndSetQuestions');
  }
  setupModelAnswers();
});

function setupModelAnswers() {
  selectedModels.value.forEach(model => {
    answers.value[model.id] = 100;
  });
}

function nextQuestion() {
  store.dispatch('addAnsweredQuestion', {
    questionId: currentQuestion.value.id,
    answers: {...answers.value}
  });
  store.dispatch('incrementQuestionIndex');
  setupModelAnswers()
}

function checkResults() {
  router.push({ name: 'CalibrationResults' });
}
</script>

<style scoped>
.question-page {
  position: relative;
  min-height: 400px;
}

.question-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px; /* Consistent padding */
  box-sizing: border-box; /* Ensures padding is included in the width */
}

.question-title {
  text-align: center;
  margin-bottom: 30px;
}

.question-title h2, .question-title h3 {
  text-align: center;
}

@media (min-width: 1300px) {
  .question-title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  .question-title h2, .question-title h3 {
    margin: 0 10px;
  }
}

.question-guidance-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-box-container, .guidance-box-container {
  width: 100%;
}

.question-box, .guidance-box {
  background-color: #f3f3f3;
  border-radius: 10px;
  padding: 20px;
  width: calc(100% - 40px); /* Full width of the container, considering container's padding */
}

.dark-mode .question-box, .dark-mode .guidance-box {
  background-color: #444;
}

@media (min-width: 1300px) {
  .question-guidance-container {
    flex-direction: row;
    justify-content: center;
  }

  .question-box-container, .guidance-box-container {
    display: flex;
    flex-direction: column; /* Makes internal content flow vertically */
  }

  .question-box, .guidance-box {
    flex-grow: 1; /* Allows these boxes to expand to fill the container */
  }
}

/* Adjustments for devices with less than 1300px screen width */
@media (max-width: 1300px) {
  .question-box, .guidance-box {
    width: calc(100% - 40px); /* Subtracts double the horizontal padding */
    margin-right: auto;
    margin-left: auto;
  }
}

.box-label {
  font-size: 0.8em;
}

.slider {
  margin: 0 10px;
  width: 200px; /* Fixed width for the slider */
}

.slider-container {
  display: flex;
  align-items: center;
  justify-content: center; /* This will space out the columns to the sides */
  margin: 30px 0; /* Gives some vertical spacing between each slider */
  max-width: 800px;
  min-width: 300px;
}

/* Add a sub-class for labels to align them to the right */
.slider-container label {
  flex: 1; /* Takes up full space it can */
  text-align: right; /* Aligns the text to the right */
  margin-right: 10px; /* Space between the label and slider */
  white-space: nowrap; /* Prevents the label from wrapping */
}

/* Control the width of sliders specifically */
.slider-container input[type="range"] {
  flex: 3; /* Slider should take more space */
}

.percent-label {
  width: 50px;
  text-align: left;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s;
}

.slide-enter-from, .slide-leave-to {
  position: absolute;
  width: 100%;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>