import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddLinkIcon from '@mui/icons-material/AddLink';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useThemeColors } from '../component/ThemeModeContext';

interface Feed {
  title: string;
  url: string;
  tags: string;
  frequency: string;
  description: string;
}

const initialFeeds: Feed[] = [
  {
    title: 'Tech News Digest',
    url: 'https://technews.com/feed',
    tags: 'Technology, News',
    frequency: 'Daily',
    description: 'A daily digest of the latest tech news.',
  },
  {
    title: 'Creative Writing Blog',
    url: 'https://creativewriting.com/feed',
    tags: 'Writing, Creativity',
    frequency: 'Weekly',
    description: 'A blog focused on creative writing tips and prompts.',
  },
  {
    title: 'Sustainable Living',
    url: 'https://sustainableliving.org/feed',
    tags: 'Sustainability, Lifestyle',
    frequency: 'Bi-weekly',
    description: 'Tips and articles on sustainable living practices.',
  },
  {
    title: 'Indie Game Reviews',
    url: 'https://indiegamereviews.com/feed',
    tags: 'Gaming, Indie',
    frequency: 'Daily',
    description: 'Reviews of the latest indie games.',
  },
  {
    title: 'Global Politics Update',
    url: 'https://globalpolitics.com/feed',
    tags: 'Politics, News',
    frequency: 'Hourly',
    description: 'Real-time updates on global political events.',
  },
];

const ManageFeeds: React.FC = () => {
  const colors = useThemeColors();

  const [feeds, setFeeds] = useState<Feed[]>(initialFeeds);
  const [selectedFeedIndex, setSelectedFeedIndex] = useState<number | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openUrlModal, setOpenUrlModal] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);

  const [editForm, setEditForm] = useState<Feed>({
    title: '',
    url: '',
    tags: '',
    frequency: '',
    description: '',
  });

  const handleEditClick = (index: number) => {
    setSelectedFeedIndex(index);
    setEditForm(feeds[index]);
    setOpenEditModal(true);
  };

  const handleEditSave = () => {
    if (selectedFeedIndex !== null) {
      const updatedFeeds = [...feeds];
      updatedFeeds[selectedFeedIndex] = editForm;
      setFeeds(updatedFeeds);
    }
    setOpenEditModal(false);
  };

  return (
    <Box p={4} sx={{ backgroundColor: colors.background.default, minHeight: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Manage Feeds
      </Typography>

      <Box mb={2} display="flex" gap={2}>
        <Button variant="contained" startIcon={<AddLinkIcon />} onClick={() => setOpenUrlModal(true)}>
          Add from URL
        </Button>
        <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setOpenFileModal(true)}>
          Add from file
        </Button>
      </Box>

      <Paper sx={{ backgroundColor: colors.background.paper }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Feed Title</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Update Frequency</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feeds.map((feed, index) => (
              <TableRow key={index}>
                <TableCell>{feed.title}</TableCell>
                <TableCell>{feed.url}</TableCell>
                <TableCell>{feed.tags}</TableCell>
                <TableCell>{feed.frequency}</TableCell>
                <TableCell>{feed.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(index)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth>
        <DialogTitle>Edit Feed</DialogTitle>
        <DialogContent>
          {(['title', 'url', 'tags', 'frequency', 'description'] as (keyof Feed)[]).map((key) => (
            <TextField
              key={key}
              margin="normal"
              fullWidth
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={editForm[key]}
              onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUrlModal} onClose={() => setOpenUrlModal(false)} fullWidth>
        <DialogTitle>Add Feed from URL</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Feed URL" margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUrlModal(false)}>Cancel</Button>
          <Button variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFileModal} onClose={() => setOpenFileModal(false)} fullWidth>
        <DialogTitle>Add Feed from File</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label">
            Select File{' '}
            <input type="file" hidden accept=".xml,.opml,.json" />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFileModal(false)}>Cancel</Button>
          <Button variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageFeeds;
