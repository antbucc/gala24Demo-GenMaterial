import React, { useState } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Typography, CircularProgress, Paper, Container } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { generateTopics, saveTopics } from '../services/apiService';

interface AnalyzeMaterialProps {
  onNext: (selectedTopic: string, materialData: any, materialUrl: string) => void;
}

const AnalyzeMaterial: React.FC<AnalyzeMaterialProps> = ({ onNext }) => {
  const [materialUrl, setMaterialUrl] = useState('');
  const [themeTitle, setThemeTitle] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [materialData, setMaterialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // Track if the topics have been saved

  const handleAnalyzeMaterial = async () => {
    setLoading(true);
    try {
      const response = await generateTopics(materialUrl);
      setTopics(response.MainTopics.map((topic: any) => topic.Topic));
      setMaterialData(response);
      setLoading(false);
    } catch (error) {
      console.error('Error analyzing material:', error);
      setLoading(false);
    }
  };

  const handleSaveTopics = async () => {
    try {
      await saveTopics({ materialUrl, themeName: themeTitle, topics });
      setIsSaved(true); // Set the state to indicate the topics have been saved
      console.log('Topics saved successfully');
    } catch (error) {
      console.error('Error saving Topics:', error);
    }
  };

  const handleNext = () => {
    if (selectedTopic && isSaved) {
      onNext(selectedTopic, materialData, materialUrl);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Step 1: Analyze Material and Select a Topic
        </Typography>
        <Box mb={2}>
          <TextField
            label="Theme Title"
            value={themeTitle}
            onChange={(e) => setThemeTitle(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Material URL"
            value={materialUrl}
            onChange={(e) => setMaterialUrl(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <Button onClick={handleAnalyzeMaterial} variant="contained" color="primary" fullWidth>
            Analyze Material
          </Button>
        </Box>
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
        {!loading && topics.length > 0 && (
          <FormControl component="fieldset">
            <FormLabel component="legend">Select a Topic</FormLabel>
            <RadioGroup value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
              {topics.map((topic, index) => (
                <FormControlLabel key={index} value={topic} control={<Radio />} label={topic} />
              ))}
            </RadioGroup>
          </FormControl>
        )}
        {!loading && topics.length > 0 && (
          <>
            <Box mt={2}>
              <Button onClick={handleSaveTopics} variant="contained"  fullWidth disabled={isSaved} startIcon={<SaveIcon />}>
                Save Topics
              </Button>
            </Box>
            <Box mt={2}>
              <Button onClick={handleNext} variant="contained" color="secondary" fullWidth disabled={!isSaved || !selectedTopic} endIcon={<ArrowForwardIcon />}>
                Next
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AnalyzeMaterial;
