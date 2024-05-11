import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import QuestionPage from '@/components/QuestionPage.vue';
import CalibrationResults from '@/components/CalibrationResults.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/question', component: QuestionPage },
  { path: '/results', component: CalibrationResults },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;