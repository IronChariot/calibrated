import axios from 'axios';

export async function fetchModels() {
  try {
    const response = await axios.get('/.netlify/functions/api/models');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch model names:', error);
    return [];  // Returning empty array as a fallback
  }
}