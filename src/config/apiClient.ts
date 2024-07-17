import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://skapi.polyglot-edu.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
