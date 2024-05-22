<!-- src/components/CalibrationResults.vue -->
<template>
  <div class="container chart-container">
    <h2>Calibration Results</h2>
    <canvas id="calibration-chart"></canvas>
    <h2>Result Details</h2>
    <div id="model-strengths"></div>
    <div id="model-weaknesses"></div>
    <div id="question-strengths"></div>
    <div id="question-weaknesses"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useDarkMode } from '@/composables/useDarkMode';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ScatterController
} from 'chart.js';
import { fetchAnswers } from '@/api'; // Adjust the path based on your project structure

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ScatterController
);

const store = useStore();
const selectedModels = computed(() => store.state.selectedModels);
const userAnswers = computed(() => store.state.answeredQuestions);
const { isDark } = useDarkMode();

const chartData = ref(null);
const chartOptions = ref({});
let chartInstance = null;

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
};

const computeAverageLines = (data) => {
  const averagePoints = {};
  data.forEach((point) => {
    if (!averagePoints[point.x]) {
      averagePoints[point.x] = { sum: 0, count: 0 };
    }
    averagePoints[point.x].sum += point.y;
    averagePoints[point.x].count += 1;
  });
  return Object.entries(averagePoints).map(([x, { sum, count }]) => ({
    x: +x,
    y: sum / count
  }));
};

onMounted(async () => {
  const apiAnswers = await fetchAnswers();

  const modelColors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'];
  selectedModels.value.forEach((model, index) => {
    model.color = modelColors[index % modelColors.length];
  });

  const perfectCalibration = {
    label: 'Perfect Calibration',
    borderColor: isDark.value ? 'white' : 'black',
    borderWidth: 1,
    data: [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    fill: false,
    spanGaps: true,
    showLine: true,
    pointRadius: 0,
    pointHoverRadius: 0,
  };

  const datasets = selectedModels.value.map((model) => {
    const userFilteredAnswers = userAnswers.value
      .filter((answer) => answer.answers[model.id] !== undefined)
      .map((answer) => ({
        x: parseFloat(apiAnswers
          .filter((apiAnswer) => apiAnswer.model_id === model.id && apiAnswer.question_id === answer.questionId)
          .map((apiAnswer) => apiAnswer.percent_correct)
          .reduce((acc, val) => acc + val, 0)),
        y: parseFloat(answer.answers[model.id])
      }))
      .sort((a, b) => a.x - b.x);

    const averageLineData = computeAverageLines(userFilteredAnswers);

    return [
      {
        label: model.model_nice_name,
        borderColor: model.color,
        backgroundColor: model.color,
        data: userFilteredAnswers,
        fill: false,
        spanGaps: true,
        showLine: false,
      },
      {
        label: `${model.model_nice_name} Average Line`,
        borderColor: model.color,
        data: averageLineData,
        fill: false,
        spanGaps: true,
        showLine: true,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
        showInLegend: false,
      }
    ];
  }).flat();

  datasets.unshift(perfectCalibration);

  chartData.value = {
    datasets
  };

  const updateChartOptions = (darkMode) => {
    chartOptions.value = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: '% correct answers for question (actual)',
            color: darkMode ? '#fff' : '#000'
          },
          ticks: {
            color: darkMode ? '#fff' : '#000'
          },
          grid: {
            color: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
          },
          min: 0,
          max: 100,
        },
        y: {
          title: {
            display: true,
            text: '% correct answers for question (user)',
            color: darkMode ? '#fff' : '#000'
          },
          ticks: {
            color: darkMode ? '#fff' : '#000'
          },
          grid: {
            color: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
          },
          min: 0,
          max: 100,
        }
      },
      plugins: {
        legend: {
          labels: {
            color: darkMode ? '#fff' : '#000',
            filter: (legendItem) => {
              return !legendItem.text.includes('Average Line');
            }
          }
        }
      }
    };
  };

  updateChartOptions(isDark.value);

  watch(isDark, (newValue) => {
    destroyChart();
    updateChartOptions(newValue);
    chartData.value.datasets[0].borderColor = newValue ? 'white' : 'black';
    const ctx = document.getElementById('calibration-chart').getContext('2d');
    chartInstance = new ChartJS(ctx, {
      type: 'scatter',
      data: {
        datasets: chartData.value.datasets
      },
      options: chartOptions.value
    });
  });

  const ctx = document.getElementById('calibration-chart').getContext('2d');
  chartInstance = new ChartJS(ctx, {
    type: 'scatter',
    data: {
      datasets: chartData.value.datasets
    },
    options: chartOptions.value
  });

  // If all the userAnswers.value were all 100 for every model and every question, just put the text "Wow, you were in a hurry, or maybe you just have great confidence in every LLM!" into the div with id "model-strengths"
  if (Array.isArray(userAnswers.value)) {
    // Perform the check with added debugging console logs
    const allAnswersAre100 = userAnswers.value.every((userAnswer) => {
      return Object.values(userAnswer.answers).every((answer) => {
        return answer === 100;
      });
    });

    if (allAnswersAre100) {
      document.getElementById('model-strengths').innerHTML = 'Wow, you were in a hurry, or maybe you just have great confidence in every LLM!';
    } else {
      WriteResultDetails();
    }
  }
  
});

onBeforeUnmount(() => {
  destroyChart();
});

const WriteResultDetails = () => {
  document.getElementById('model-strengths').innerHTML = "...";
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  width: 90%;
  margin: 0px auto 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.dark-mode .container {
  background-color: #333;
}

.chart-container {
  position: relative;
  height: 500px;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>