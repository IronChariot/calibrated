<!-- src/components/CalibrationResults.vue -->
<template>
  <div class="container chart-container">
    <h2>Calibration Results</h2>
    <canvas id="calibration-chart"></canvas>
    <div class="legend">
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useDarkMode } from '@/composables/useDarkMode'; // Import the composable
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
const { isDark } = useDarkMode(); // Use the composable

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

  const modelColors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56']; // Define more colors if there are more models
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
          .reduce((acc, val) => acc + val, 0)), // Assuming we want the average if there are multiple answers
        y: parseFloat(answer.answers[model.id])
      }))
      .sort((a, b) => a.x - b.x); // Sort by x value

    const averageLineData = computeAverageLines(userFilteredAnswers);

    return [
      {
        label: model.model_nice_name,
        borderColor: model.color,
        backgroundColor: model.color, // Background color for the points
        data: userFilteredAnswers,
        fill: false,
        spanGaps: true,
        showLine: false, // Set showLine to false to remove connecting lines
      },
      {
        label: `${model.model_nice_name} Average Line`,
        borderColor: model.color,
        data: averageLineData,
        fill: false,
        spanGaps: true,
        showLine: true,
        borderDash: [5, 5], // Add a dashed line for distinction
        pointRadius: 0, // Don't show points on the average line
        pointHoverRadius: 0, // No hover effect for points
        showInLegend: false, // Remove from legend
      }
    ];
  }).flat();

  datasets.unshift(perfectCalibration);  // Add the perfect calibration line as the first dataset

  chartData.value = {
    datasets
  };

  // Function to update chart options
  const updateChartOptions = (darkMode) => {
    chartOptions.value = {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: '% of time LLM answered correctly',
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
            text: 'User estimate of % of time LLM would be correct',
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
              // Only show legends for datasets with showInLegend as true or undefined
              return !legendItem.text.includes('Average Line');
            }
          }
        }
      }
    };
  };

  // Initial chart options setup
  updateChartOptions(isDark.value);

  // Watch for dark mode changes
  watch(isDark, (newValue) => {
    updateChartOptions(newValue);
    destroyChart(); // Destroy any existing chart instance
    const ctx = document.getElementById('calibration-chart').getContext('2d');
    chartInstance = new ChartJS(ctx, {
      type: 'scatter', // Ensure the type is scatter for calibration graph
      data: {
        datasets: chartData.value.datasets
      },
      options: chartOptions.value
    });
  });

  // Initial chart creation
  const ctx = document.getElementById('calibration-chart').getContext('2d');
  chartInstance = new ChartJS(ctx, {
    type: 'scatter', // Ensure the type is scatter for calibration graph
    data: {
      datasets: chartData.value.datasets
    },
    options: chartOptions.value
  });
});

onBeforeUnmount(() => {
  destroyChart(); // Ensure the chart is destroyed when the component is unmounted
});
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
</style>