import axios from 'axios';

export async function fetchModels() {
  try {
    const response = await axios.get('/.netlify/functions/api/models');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];  // Returning empty array as a fallback
  }
}

export async function fetchQuestions() {
  try {
    const response = await axios.get('/.netlify/functions/api/questions');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return [];  // Returning empty array as a fallback
  }
}