<template>
  <div>
    <AnimatedModelName />
    <div class="content-section">
      <div class="text-column">
        <p>We know large language models aren't perfect. They hallucinate, contradict themselves, and can't yet reason to the level we'd expect from something called AI. But they get some things right some of the time, and the more advanced models obviously get things right more often than weaker models. I set up this website to help people get a sense of how well calibrated they are when it comes to which questions certain models get wrong or right, and how often. Have a go and see how you do!</p>
        <p>Select a model below and clicking 'Start'. You will be shown a question or prompt, alongside a slider to select your guess of how often the given model gets this answer wrong when its temperature is set to 1.0, mimicking a likely chatbot type setting.</p>
        <p>After at least 10 guesses, you will be able to check how good your calibration is, or continue answering to get more accurate results.</p>
      </div>
      <div class="image-column">
        <img src="@/assets/example-graph.png" alt="Calibration graph" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Import your AnimatedModelName component
import AnimatedModelName from './AnimatedModelName.vue';
</script>

<style scoped>
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

@media (max-width: 1300px) {
  .content-section {
    flex-direction: column;
  }
  
  .text-column, .image-column {
    /* centered, max width 500px */
    max-width: 500px;
    min-width: 500px;
    justify-content: center;
    padding: 0;
  }
}
</style>