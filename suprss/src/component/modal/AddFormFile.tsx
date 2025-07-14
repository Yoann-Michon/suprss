import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const AddFeedFromFile: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      console.log('Selected file:', file);
      // TODO: parse file content or upload
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={1}>
      <Button variant="outlined" component="label">
        Select File
        <input type="file" hidden accept=".xml,.opml,.json" onChange={handleFileChange} />
      </Button>
      {fileName && <Typography variant="body2">Selected: {fileName}</Typography>}
      <Button variant="contained" disabled={!fileName}>
        Add Feed
      </Button>
    </Box>
  );
};

export default AddFeedFromFile;
