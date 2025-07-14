import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Chip,
  Autocomplete,
} from '@mui/material';

const frequencies = ['Hourly', 'Daily', 'Weekly', 'Bi-weekly', 'Monthly'];

const AddFeedFromUrl = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    const feedData = {
      title,
      url,
      tags,
      frequency,
      description,
    };
    console.log('Submitting new feed:', feedData);
  };

  return (
    <Box component="form" display="flex" flexDirection="column" gap={2} mt={1}>
      <TextField
        label="Feed Title"
        value={title}
        fullWidth
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Feed URL"
        value={url}
        fullWidth
        onChange={(e) => setUrl(e.target.value)}
      />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={tags}
        onChange={(_, newValue) => setTags(newValue)}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Tags" placeholder="Add tag..." />
        )}
      />

      <TextField
        select
        label="Update Frequency"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        fullWidth
      >
        {frequencies.map((freq) => (
          <MenuItem key={freq} value={freq}>
            {freq}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Description"
        value={description}
        multiline
        rows={3}
        fullWidth
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button variant="contained" onClick={handleSubmit}>
        Add Feed
      </Button>
    </Box>
  );
};

export default AddFeedFromUrl;
