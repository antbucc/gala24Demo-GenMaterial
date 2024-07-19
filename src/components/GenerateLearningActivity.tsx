import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, Paper, Container, List, ListItem } from '@mui/material';
import { generateMaterial, generateActivity, saveLearningActivity } from '../services/apiService';
import SaveIcon from '@mui/icons-material/Save';
import { ToastContainer, toast } from 'react-toastify';
interface GenerateLearningActivityProps {
  objective: string;
  topic: string;
  title: string;
  bloomLevel: string;
  materialData: any;
  materialUrl: string;
  onFinish: (activity: string) => void;
}

// Define the bloom levels
const bloomLevels = [
  'Remembering',
  'Understanding',
  'Applying',
  'Analyzing',
  'Evaluating',
  'Creating'
];

const GenerateLearningActivity: React.FC<GenerateLearningActivityProps> = ({
  objective,
  topic,
  title,
  bloomLevel,
  materialData,
  materialUrl,
  onFinish,
}) => {
  const [activityResponse, setActivityResponse] = useState<any>(null);
  const [readingMaterial, setReadingMaterial] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [numWords, setNumWords] = useState<number>(20);
  const [correctAnswers, setCorrectAnswers] = useState<number>(1);
  const [distractors, setDistractors] = useState<number>(1);
  const [discardableDistractors, setDiscardableDistractors] = useState<number>(1);
  const [level, setLevel] = useState<number>(0); // Add state for level
  const [isMCInputsValid, setIsMCInputsValid] = useState<boolean>(true); // Default to true since we have initial valid values

  useEffect(() => {
    setIsMCInputsValid(
      correctAnswers !== null &&
      correctAnswers >= 0 &&
      distractors !== null &&
      distractors >= 0 &&
      discardableDistractors !== null &&
      discardableDistractors >= 0
    );
  }, [correctAnswers, distractors, discardableDistractors]);

  const handleGenerateReadingMaterial = async () => {
    setLoading(true);
    try {
      const params = {
        macroSubject: materialData.MacroSubject,
        title: title,
        level: level, // Include level here
        typeOfActivity: 0,
        learningObjective: objective,
        bloomLevel: bloomLevel,
        language: materialData.language,
        material: materialUrl,
        numberOfWords: numWords,
        assignmentType: 0,
        topic: topic,
        temperature: 0,
      };

      const generatedMaterial = await generateMaterial(params);
      setReadingMaterial(generatedMaterial);
      setLoading(false);
    } catch (error) {
      console.error('Error generating reading material:', error);
      setLoading(false);
    }
  };

  const handleGenerateActivity = async () => {
    setLoading(true);

    // retrieve the index of the bloom level
    const bloomLevelIndex = bloomLevels.indexOf(bloomLevel);

    try {
      const params = {
        macroSubject: materialData.MacroSubject,
        title: title,
        level: level, // Include level here
        typeOfActivity: 4, // Multiple-Choice
        learningObjective: objective,
        bloomLevel: bloomLevelIndex,
        language: materialData.Language,
        material: materialUrl,
        correctAnswersNumber: correctAnswers,
        distractorsNumber: distractors,
        easilyDiscardableDistractorsNumber: discardableDistractors,
        assignmentType: 0,
        topic: topic,
        temperature: 0,
        readingMaterial: readingMaterial, // Use the generated reading material
        bloomLevelString: bloomLevel,
      };


      const generatedActivity = await generateActivity(params);
      setActivityResponse(generatedActivity);
      setLoading(false);
    } catch (error) {
      console.error('Error generating activity:', error);
      setLoading(false);
    }
  };

  const handleFinishMultipleChoice = async () => {
    if (activityResponse && readingMaterial) {
      console.log("BLOOM LEVEL: "+bloomLevel);
      try {
        const activityData = {
          topic: topic,
          learningObjective: objective,
          activityType: 'MultipleChoice',
          assignment: activityResponse.Assignment,
          correctSolutions: activityResponse.Solutions,
          distractors: activityResponse.Distractors,
          easilyDiscardableDistractors: activityResponse.EasilyDiscardableDistractors,
          feedback: activityResponse.Plus,
          readingMaterial: readingMaterial,
          bloomLevel: bloomLevel,
        };
       await saveLearningActivity(activityData);
       console.log('Multiple-choice activity saved successfully');
        toast.success("The activity has been saved correctly");
       onFinish(JSON.stringify(activityData));
      } catch (error) {
        console.error('Error saving multiple-choice activity:', error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Step 3: Generate Learning Activity
        </Typography>
        {!readingMaterial && (
          <>
            <Box mb={2}>
              <TextField
                label="Number of Words"
                type="number"
                value={numWords || ''}
                onChange={(e) => setNumWords(Number(e.target.value))}
                fullWidth
                variant="outlined"
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Level"
                type="number"
                value={level || ''}
                onChange={(e) => setLevel(Number(e.target.value))}
                fullWidth
                variant="outlined"
              />
            </Box>
            <Box mb={2}>
              <Button
                onClick={handleGenerateReadingMaterial}
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || numWords === null || numWords <= 0}
              >
                Generate Reading Material
              </Button>
            </Box>
          </>
        )}
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
        {readingMaterial && !activityResponse && (
          <>
            <Box mb={2}>
              <TextField
                label="Number of Correct Answers"
                type="number"
                value={correctAnswers || ''}
                onChange={(e) => setCorrectAnswers(Number(e.target.value))}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Number of Distractors"
                type="number"
                value={distractors || ''}
                onChange={(e) => setDistractors(Number(e.target.value))}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Number of Discardable Distractors"
                type="number"
                value={discardableDistractors || ''}
                onChange={(e) => setDiscardableDistractors(Number(e.target.value))}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '10px' }}
              />
            </Box>
            <Box mb={2}>
              <Button
                onClick={handleGenerateActivity}
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isMCInputsValid || loading}
              >
                Generate Multiple-Choice Activity
              </Button>
            </Box>
          </>
        )}
        {activityResponse && (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              Assignment:
            </Typography>
            <TextField
              label="Assignment"
              value={activityResponse.Assignment}
              fullWidth
              multiline
              rows={4}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <Typography variant="h6" component="h2" gutterBottom>
              Correct Solutions:
            </Typography>
            <List>
              {activityResponse.Solutions.map((solution: string, index: number) => (
                <ListItem key={index} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <TextField
                    label={`Solution ${index + 1}`}
                    value={solution}
                    fullWidth
                    multiline
                    rows={3}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    margin="normal"
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" component="h2" gutterBottom>
              Distractors:
            </Typography>
            <List>
              {activityResponse.Distractors.map((distractor: string, index: number) => (
                <ListItem key={index} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <TextField
                    label={`Distractor ${index + 1}`}
                    value={distractor}
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    margin="normal"
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" component="h2" gutterBottom>
              Easily Discardable Distractors:
            </Typography>
            <List>
              {activityResponse.EasilyDiscardableDistractors.map((distractor: string, index: number) => (
                <ListItem key={index} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <TextField
                    label={`Easily Discardable Distractor ${index + 1}`}
                    value={distractor}
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    margin="normal"
                  />
                </ListItem>
              ))}
            </List>
            <TextField
              label="Feedback"
              value={activityResponse.Plus}
              fullWidth
              multiline
              rows={5}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <Box mt={2}>
              <Button 
                onClick={handleFinishMultipleChoice} 
                variant="contained" 
                color="primary" 
                fullWidth 
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <ToastContainer />
              
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default GenerateLearningActivity;
