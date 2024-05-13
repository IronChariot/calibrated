import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import QuestionPage from '@/components/QuestionPage.vue';
import CalibrationResults from '@/components/CalibrationResults.vue';

const routes = [
  { 
    path: '/', 
    name: 'HomePage', 
    component: HomePage },
  {
    path: '/question',
    name: 'QuestionPage',
    component: QuestionPage,
    props: route => ({ selectedModels: route.params.selectedModels })
  },
  { path: '/results', 
    name: 'CalibrationResults', 
    component: CalibrationResults,
    props: route => ({ answeredQuestions: route.params.answeredQuestions })
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;