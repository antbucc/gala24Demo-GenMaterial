import axios from 'axios';

//API for the GenAI
const apiClient_SK = axios.create({
  baseURL: 'https://skapi.polyglot-edu.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Backend for the App to save data in the MongoDB
const apiClient = axios.create({
    baseURL: 'http://localhost:5002', 
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  export const saveLearningActivity = async (learningActivity: any) => {
    try {
      const response = await apiClient.post('/save-activity', learningActivity);
      return response.data;
    } catch (error) {
      console.error('Error saving learning activity:', error);
      throw error;
    }
  };

  // function to save topics
export const saveTopics = async (material: { materialUrl: string; themeName: string; topics: string[] }) => {
    try {
      const response = await apiClient.post('/save-topics', material);
      return response.data;
    } catch (error) {
      console.error('Error saving material:', error);
      throw error;
    }
  };

  
const API_KEY = process.env.REACT_APP_API_KEY || '';
const SETUP_MODEL = process.env.REACT_APP_SETUP_MODEL || '';

export const generateTopics = async (materialUrl: string) => {
  const endpoint = '/MaterialAnalyser/analyseMaterial';
  const headers = {
    'ApiKey': API_KEY,
    'SetupModel': SETUP_MODEL,
  };
  const body = { material: materialUrl };

  console.log(`Calling endpoint: ${apiClient_SK.defaults.baseURL}${endpoint}`);
  console.log('Headers:', headers);
  console.log('Body:', body);

  try {
    const response = await apiClient_SK.post(endpoint, body, { headers });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw error;
  }
};


// function to add reading material to an existing topic
export const addReadingMaterial = async (data: { topic: string; readingMaterial: any }) => {
    try {
      const response = await apiClient.post('/add-reading-material', data);
      return response.data;
    } catch (error) {
      console.error('Error adding reading material:', error);
      throw error;
    }
  };

export const generateObjectives = async (topic: string, context: string, level: number) => {
  const endpoint = '/LearningObjectiveGenerator/generateLearningObjective';
  const headers = {
    'ApiKey': API_KEY,
    'SetupModel': SETUP_MODEL,
  };
  const body = { topic, context, level };

  console.log(`Calling endpoint: ${apiClient_SK.defaults.baseURL}${endpoint}`);
  console.log('Headers:', headers);
  console.log('Body:', body);

  try {
    const response = await apiClient_SK.post(endpoint, body, { headers });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating objectives:', error);
    throw error;
  }
};



export const generateMaterial = async (params: {
    level: number;
    learningObjective: string;
    topic: string;
    numberOfWords: number;
  }) => {
    const endpoint = '/MaterialGenerator/generateMaterial';
    const headers = {
      'ApiKey': API_KEY,
      'SetupModel': SETUP_MODEL,
    };
  
    console.log(`Calling endpoint: ${apiClient_SK.defaults.baseURL}${endpoint}`);
    console.log('Headers:', headers);
    console.log('Body:', params);
  
    try {
      const response = await apiClient_SK.post(endpoint, params, { headers });
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating activity:', error);
      throw error;
    }
  };

export const generateActivity = async (params: {
  macroSubject: string;
  title: string;
  level: number;
  typeOfActivity: number;
  learningObjective: string;
  bloomLevel: number;
  language: string;
  material: string;
  correctAnswersNumber: number;
  distractorsNumber: number;
  easilyDiscardableDistractorsNumber: number;
  assignmentType: number;
  topic: string;
  temperature: number;
}) => {
  const endpoint = '/ActivityGenerator/generateActivity';
  const headers = {
    'ApiKey': API_KEY,
    'SetupModel': SETUP_MODEL,
  };

  console.log(`Calling endpoint: ${apiClient_SK.defaults.baseURL}${endpoint}`);
  console.log('Headers:', headers);
  console.log('Body:', params);

  try {
    const response = await apiClient_SK.post(endpoint, params, { headers });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating activity:', error);
    throw error;
  }
};
