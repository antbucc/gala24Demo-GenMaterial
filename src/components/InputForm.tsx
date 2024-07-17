import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

interface InputFormProps {
  onSubmit: (url: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Material URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Fetch Material
      </Button>
    </form>
  );
};

export default InputForm;
export {}; // Add this line to make the file a module
