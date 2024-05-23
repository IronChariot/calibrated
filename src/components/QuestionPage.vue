<!-- src\components\QuestionPage.vue -->
<template>
  <div class="question-page">
    <transition name="slide">
      <div v-if="currentQuestion" :key="currentQuestion" class="question-content">
        <div class="question-title">
          <h2>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</h2>
          <h3>({{ currentQuestion.category }})</h3>
        </div>
        
        <!-- Container for question and guidance -->
        <div class="question-guidance-container">
          <div class="question-box-container">
            <label class="box-label">Exact Prompt:</label>
            <div class="question-box" :style="{ whiteSpace: 'pre-line' }">{{ currentQuestion.question_text }}</div>
          </div>
          <div class="guidance-box-container">
            <label class="box-label">Answer Guidance:</label>
            <div class="guidance-box">{{ currentQuestion.answer_guidance }}</div>
          </div>
        </div>

        <!-- Slider section with model label and percentage display -->
        <div class="slider-container">
          <div class="instruction">
            <div class="instruction-tooltip-container">
              <span class="instruction-question-mark" @click="toggleTooltip">?</span>
              <div v-if="showTooltip" class="instruction-tooltip">
                Alternatively, think about it as the number of times the model will answer correctly if asked 100 times with a temperature of 1.0, which is how the ground truth is assessed!
              </div>
            </div>
            <span>Chance that the model will answer correctly:</span>
          </div>
          <div class="slider-grid">
            <div v-for="model in selectedModels" :key="model.id" class="slider-grid-item">
              <label>{{ model.model_nice_name }}</label>
              <input type="range" min="0" max="100" v-model="answers[model.id]" class="slider" />
              <span class="percent-label">{{ answers[model.id] }}%</span>
            </div>
          </div>
        </div>

        <!-- Navigation buttons -->
        <div class="navigation-buttons">
          <button v-if="currentQuestionIndex < questions.length - 1" @click="nextQuestion" class="next-question-button">Next Question</button>
          <button v-if="answeredQuestions.length >= 10" @click="checkResults" class="check-results-button">Check Calibration Results</button>
        </div>
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

const showTooltip = ref(false);

// Unified toggle function for both touch and mouse events
const toggleTooltip = (event) => {
  event.stopPropagation(); // Prevent other event handlers from interfering
  showTooltip.value = !showTooltip.value;
};

// Close tooltip when tapping outside of it
const handleClickOutside = (event) => {
  if (showTooltip.value && !event.target.closest('.instruction-tooltip-container')) {
    showTooltip.value = false;
  }
};

onMounted(async () => {
  if (store.state.questions.length === 0) {
    await store.dispatch('fetchAndSetQuestions');
  }
  setupModelAnswers();
  document.addEventListener('click', handleClickOutside);
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
  setupModelAnswers();
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

@media (min-width: 1000px) {
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

@media (min-width: 1000px) {
  .question-guidance-container {
    flex-direction: row;
    justify-content: center;
  }

  .question-box-container, .guidance-box-container {
    display: flex;
    flex-direction: column; /* Makes internal content flow vertically */
    width: 500px;
  }

  .question-box, .guidance-box {
    flex-grow: 1; /* Allows these boxes to expand to fill the container */
  }
}

/* Adjustments for devices with less than 1000px screen width */
@media (max-width: 1000px) {
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
  max-width: 1000px;
  margin: 30px auto;
}

.instruction {
  margin-bottom: 20px;
}

.instruction-tooltip-container {
  position: relative;
  display: inline-block;
  margin-right: 10px;
}

.instruction-question-mark {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #ccc;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
}

.instruction-tooltip {
  visibility: visible;
  min-width: 330px;
  max-width: 630px;
  background-color: #ccc;
  color: #222;
  text-align: left;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  top: 150%; /* Position below the question mark */
  left: 50%;
  margin-left: 0px; /* Center the tooltip */
}

.dark-mode .instruction-tooltip {
  background-color: #444;
  color: #fff;
}

.instruction-tooltip::after {
  content: "";
  position: absolute;
  bottom: 100%; /* Position the arrow at the top of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.dark-mode .instruction-tooltip::after {
  border-color: #ccc transparent transparent transparent;
}

.slider-grid {
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  grid-gap: 30px 10px;
  align-items: center;
}

.slider-grid-item {
  display: contents;
}

.slider-grid-item label {
  text-align: right;
  margin-right: 10px;
  /* Don't let it word wrap */
  white-space: nowrap;
}

.slider-grid-item input[type="range"] {
  width: 100%;
}

.slider-grid-item .percent-label {
  width: 50px;
  text-align: left;
  margin-left: 30px;
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

.navigation-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.check-results-button {
  margin-left: 20px;
  background-color: #3f96fa;
}

/* Media query for screens narrower than 1000px */
@media (max-width: 1000px) {
  .navigation-buttons {
    flex-direction: column;
    align-items: center; /* Ensure buttons stay centered on smaller screens */
  }

  .check-results-button {
    margin-left: 0;
    margin-top: 10px; /* Add some space between the buttons vertically */
  }
}
</style>