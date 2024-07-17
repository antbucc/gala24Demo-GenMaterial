import React, { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, List, ListItem, ListSubheader, Box, Typography, CircularProgress, Paper, Container } from '@mui/material';
import { generateObjectives } from '../services/apiService';

interface GenerateLearningObjectivesProps {
  topic: string;
  context: string;
  level: number;
  materialUrl: string;
  onNext: (selectedObjective: string, bloomLevel: number, materialData: any) => void;
  materialData: any;
}

const GenerateLearningObjectives: React.FC<GenerateLearningObjectivesProps> = ({ topic, context, level, materialUrl, onNext, materialData }) => {
  const [objectives, setObjectives] = useState<any>({});
  const [selectedObjective, setSelectedObjective] = useState<string>('');
  const [selectedBloomLevel, setSelectedBloomLevel] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchObjectives = async () => {
      setLoading(true);
      try {
        const fetchedObjectives = await generateObjectives(topic, context, level);
        setObjectives(fetchedObjectives);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching objectives:', error);
        setLoading(false);
      }
    };
    fetchObjectives();
  }, [topic, context, level]);

  const handleNext = () => {
    if (selectedObjective && selectedBloomLevel) {
      onNext(selectedObjective, parseInt(selectedBloomLevel), materialData);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Step 2: Generate and Select a Learning Objective
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          <FormControl component="fieldset">
            <FormLabel component="legend">Select a Learning Objective</FormLabel>
            {Object.keys(objectives).map((bloomLevel, index) => (
              <List key={index} subheader={<ListSubheader>{bloomLevel}</ListSubheader>} component="nav">
                <RadioGroup value={selectedObjective} onChange={(e) => {
                  setSelectedObjective(e.target.value);
                  setSelectedBloomLevel(bloomLevel);
                }}>
                  {objectives[bloomLevel].map((objective: string, idx: number) => (
                    <ListItem key={idx}>
                      <FormControlLabel value={objective} control={<Radio />} label={objective} />
                    </ListItem>
                  ))}
                </RadioGroup>
              </List>
            ))}
          </FormControl>
        )}
        {!loading && (
          <Box mt={2}>
            <Button onClick={handleNext} variant="contained" color="primary" fullWidth disabled={!selectedObjective || !selectedBloomLevel}>
              Next
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default GenerateLearningObjectives;
