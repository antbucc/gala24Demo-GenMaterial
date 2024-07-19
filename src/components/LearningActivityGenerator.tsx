import React, { useState } from 'react';
import { Container, Box, Stepper, Step, StepLabel, Paper } from '@mui/material';
import AnalyzeMaterial from './AnalyzeMaterial';
import GenerateLearningObjectives from './GenerateLearningObjectives';
import GenerateLearningActivity from './GenerateLearningActivity';

import 'react-toastify/dist/ReactToastify.css';

//import { saveLearningActivity } from '../services/apiService';  // Import the API service

const steps = ['Analyze Material', 'Generate Learning Objectives', 'Generate Learning Activity'];

const LearningActivityGenerator: React.FC = () => {
  const [step, setStep] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedObjective, setSelectedObjective] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [bloomLevel, setBloomLevel] = useState<string>('');
  const [materialData, setMaterialData] = useState<any>(null);
  const [context] = useState<string>('string'); 
  const [level] = useState<number>(0);  
  const [materialUrl, setMaterialUrl] = useState<string>('');  


  const handleNextStep = (data: string, titleData?: string, materialData?: any, bloomLevelData?: string, newMaterialUrl?: string) => {
    console.log("Moving to next step:", step);
    console.log('Next step data:', data, "URL:", newMaterialUrl);
    if (step === 0) {
      setSelectedTopic(data);
      setTitle(titleData || '');
      setMaterialData(materialData || null);
      setMaterialUrl(newMaterialUrl || '' );
    } else if (step === 1) {
      setSelectedObjective(data);
      setBloomLevel(bloomLevelData || '');
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handleStepClick = (index: number) => {
    if (index < step) {
      setStep(index);
    }
  };

  const handleFinish = async (generatedActivity: string) => {
   // setActivity(generatedActivity);
  //  setSavedActivityData(generatedActivity);
    //setStep(3);
   
  };
  


  return (
    <Container>
      <Box my={4}>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} onClick={() => handleStepClick(index)} completed={step > index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        {step === 0 && <AnalyzeMaterial onNext={(topic, materialData, newMaterialUrl) => handleNextStep(topic, '', materialData, bloomLevel, newMaterialUrl)} />}
        {step === 1 && (
          <GenerateLearningObjectives
            topic={selectedTopic}
            context={context}
            level={level}
            materialUrl={materialUrl}
            onNext={(objective, bloomLevel, materialData) => handleNextStep(objective, '', materialData, bloomLevel, materialUrl)}
            materialData={materialData}
          />
        )}
        {step === 2 && (
          <GenerateLearningActivity
            objective={selectedObjective}
            topic={selectedTopic}
            title={title}
            bloomLevel={bloomLevel}
            materialData={materialData}
            materialUrl={materialUrl}
            onFinish={handleFinish}
          />
        )}
       
      </Paper>
    </Container>
  );
};

export default LearningActivityGenerator;
