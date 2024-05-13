// src/store/index.js
import { createStore } from 'vuex';
import { fetchQuestions } from '../api';

// Utility to load state from localStorage
function loadState() {
  try {
    const serializedState = localStorage.getItem('vuexState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

// Utility to save state to localStorage
function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('vuexState', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
}

export default createStore({
  state() {
    const savedState = loadState();
    return {
      ...savedState,
      selectedModels: savedState?.selectedModels || [],
      answeredQuestions: savedState?.answeredQuestions || [],
      questions: savedState?.questions || [],
      currentQuestionIndex: savedState?.currentQuestionIndex || 0,
      userPrefersDarkMode: savedState?.userPrefersDarkMode || false
    };
  },
  mutations: {
    setSelectedModels(state, models) {
      state.selectedModels = models;
      saveState(state);
    },
    setAnsweredQuestions(state, questions) {
      state.answeredQuestions = questions;
      saveState(state);
    },
    setQuestions(state, questions) {
      state.questions = questions;
      saveState(state);
    },
    setCurrentQuestionIndex(state, index) {
      state.currentQuestionIndex = index;
      saveState(state);
    },
    resetState(state) {
      state.selectedModels = [];
      state.answeredQuestions = [];
      state.questions = [];
      state.currentQuestionIndex = 0;
      saveState(state);
    },
    setUserPrefersDarkMode(state, value) {
      state.userPrefersDarkMode = value;
      saveState(state);
    }
  },
  actions: {
    async fetchAndSetQuestions({ commit }) {
      try {
        const questions = await fetchQuestions();
        commit('setQuestions', questions);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    },
    setModels({ commit }, models) {
      commit('setSelectedModels', models);
    },
    addAnsweredQuestion({ commit, state }, answer) {
      const updatedAnswers = [...state.answeredQuestions, answer];
      commit('setAnsweredQuestions', updatedAnswers);
    },
    incrementQuestionIndex({ commit, state }) {
      const newIndex = state.currentQuestionIndex + 1;
      commit('setCurrentQuestionIndex', newIndex);
    },
    reset({ commit }) {
      commit('resetState');
    },
    toggleDarkMode({ commit, state }) {
      commit('setUserPrefersDarkMode', !state.userPrefersDarkMode);
    }
  }
});