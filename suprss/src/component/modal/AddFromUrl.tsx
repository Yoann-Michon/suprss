import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Chip,
  Autocomplete,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api.service';

const frequencies = ['Hourly', 'Daily', 'Weekly'];

interface FeedData {
  name: string;
  url: string;
  tags: string[];
  frequency: string;
  description: string;
}

const AddFeedFromUrl = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<FeedData>({
    name: '',
    url: '',
    tags: [],
    frequency: 'Daily',
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.url || !formData.frequency) {
      setError(t('features.manageFeeds.messages.missingFields') );
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await api('/feed', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        url: '',
        tags: [],
        frequency: 'Daily',
        description: '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      setError(t('features.manageFeeds.messages.errorAdd') );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FeedData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  return (
    <Box component="form" display="flex" flexDirection="column" gap={2} mt={1}>
      {success && (
        <Alert severity="success" onClose={() => setSuccess(false)}>
          {t('auth.api.register_success')} - Feed added successfully!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TextField
        label={t('features.manageFeeds.fields.title')}
        value={formData.name}
        fullWidth
        required
        onChange={(e) => updateField('name', e.target.value)}
        error={!formData.name && error !== null}
        helperText={!formData.name && error ? 'Feed title is required' : ''}
      />

      <TextField
        label={t('features.manageFeeds.fields.url')}
        value={formData.url}
        fullWidth
        required
        type="url"
        onChange={(e) => updateField('url', e.target.value)}
        error={!formData.url && error !== null}
        helperText={!formData.url && error ? 'Feed URL is required' : 'Enter the RSS feed URL'}
        placeholder="https://example.com/feed.xml"
      />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={formData.tags}
        onChange={(_, newValue) => updateField('tags', newValue)}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip 
              label={option} 
              {...getTagProps({ index })} 
              key={option}
              size="small"
            />
          ))
        }
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={t('features.manageFeeds.fields.tags')} 
            placeholder={t('common.add') + " tag..."} 
            helperText="Press Enter to add tags"
          />
        )}
      />

      <TextField
        select
        label={t('features.manageFeeds.fields.frequency')}
        value={formData.frequency}
        onChange={(e) => updateField('frequency', e.target.value)}
        fullWidth
        required
        helperText="How often should we check for new articles?"
      >
        {frequencies.map((freq) => (
          <MenuItem key={freq} value={freq}>
            {freq}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label={t('features.manageFeeds.fields.description')}
        value={formData.description}
        multiline
        rows={3}
        fullWidth
        onChange={(e) => updateField('description', e.target.value)}
        placeholder="Optional description for this feed..."
      />

      <Button 
        variant="contained" 
        onClick={handleSubmit}
        disabled={loading || !formData.name || !formData.url}
        startIcon={loading ? <CircularProgress size={20} /> : undefined}
        sx={{ mt: 2 }}
      >
        {loading ? t('loading.message') : t('actions.addFeed')}
      </Button>
    </Box>
  );
};

export default AddFeedFromUrl;