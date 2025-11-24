import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860').replace('0.0.0.0', 'localhost');

export async function classifyImage(file, userEmail = null) {
  const formData = new FormData();
  formData.append('file', file);
  if (userEmail) {
    formData.append('user_email', userEmail);
  }

  try {
    const response = await axios.post(`${API_URL}/api/classify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      throw new Error(error.response.data.detail || 'Server error');
    } else if (error.request) {
      throw new Error('Cannot connect to API server. Make sure the backend is running.');
    } else {
      throw new Error('Failed to process request');
    }
  }
}

export async function submitFeedback(analysisId, isCorrect, correctedLabel = null) {
  try {
    await axios.post(`${API_URL}/api/feedback`, {
      analysis_id: analysisId,
      is_correct: isCorrect,
      corrected_label: correctedLabel
    });
  } catch (error) {
    console.error('Feedback Error:', error);
  }
}

export async function getHistory(userEmail) {
  try {
    const response = await axios.get(`${API_URL}/api/history`, {
      params: { user_email: userEmail }
    });
    return response.data;
  } catch (error) {
    console.error('History Error:', error);
    return [];
  }
}

export async function checkHealth() {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  } catch (error) {
    return { status: 'unhealthy' };
  }
}
