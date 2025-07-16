import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useThemeColors } from '../component/ThemeModeContext';
import { useTranslation } from 'react-i18next';
import CustomSpeedDial from '../component/CustomSpeedDial';
import ModalWrapper from '../component/modal/ModalWrapper';
import ExportData from '../component/modal/ExportData';

interface Feed {
  id: number;
  title: string;
  url: string;
  tags: string;
  frequency: string;
  description: string;
}

const initialFeeds: Feed[] = [
  {
    id: 1,
    title: 'Tech News Digest',
    url: 'https://technews.com/feed',
    tags: 'Technology, News',
    frequency: 'Daily',
    description: 'A daily digest of the latest tech news.',
  },
  {
    id: 2,
    title: 'Creative Writing Blog',
    url: 'https://creativewriting.com/feed',
    tags: 'Writing, Creativity',
    frequency: 'Weekly',
    description: 'A blog focused on creative writing tips and prompts.',
  },
  {
    id: 3,
    title: 'Sustainable Living',
    url: 'https://sustainableliving.org/feed',
    tags: 'Sustainability, Lifestyle',
    frequency: 'Bi-weekly',
    description: 'Tips and articles on sustainable living practices.',
  },
  {
    id: 4,
    title: 'Indie Game Reviews',
    url: 'https://indiegamereviews.com/feed',
    tags: 'Gaming, Indie',
    frequency: 'Daily',
    description: 'Reviews of the latest indie games.',
  },
  {
    id: 5,
    title: 'Global Politics Update',
    url: 'https://globalpolitics.com/feed',
    tags: 'Politics, News',
    frequency: 'Hourly',
    description: 'Real-time updates on global political events.',
  },
];

const ManageFeeds = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [openExportModal, setOpenExportModal] = useState(false);
  const [feeds, setFeeds] = useState<Feed[]>(initialFeeds);
  const [editForm, setEditForm] = useState<Feed | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openUrlModal, setOpenUrlModal] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);

  const handleEditClick = (feed: Feed) => {
    setEditForm(feed);
    setOpenEditModal(true);
  };

  const handleEditSave = () => {
    if (editForm) {
      setFeeds((prev) =>
        prev.map((f) => (f.id === editForm.id ? editForm : f))
      );
      setOpenEditModal(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: t('manageFeeds.table.feedTitle'), flex: 1 },
    { field: 'url', headerName: t('manageFeeds.table.url'), flex: 1 },
    { field: 'tags', headerName: t('manageFeeds.table.tags'), flex: 1 },
    {
      field: 'frequency',
      headerName: t('manageFeeds.table.updateFrequency'),
      width: 150,
    },
    {
      field: 'description',
      headerName: t('manageFeeds.table.description'),
      flex: 2,
    },
    {
      field: 'actions',
      headerName: t('manageFeeds.table.actions'),
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <IconButton onClick={() => handleEditClick(row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p={4} sx={{ backgroundColor: colors.background.default, minHeight: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {t('manageFeeds.title')}
      </Typography>

      <Paper sx={{ height: 500, backgroundColor: colors.background.paper }}>
        <DataGrid
          rows={feeds}
          columns={columns}
          disableRowSelectionOnClick
          sx={{
            height: '100%', width: '100%',
            border: 'none',
            '& .MuiDataGrid-cell': { color: colors.text.primary },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.background.hover }
          }}
        />
      </Paper>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth>
        <DialogTitle>{t('manageFeeds.editFeed')}</DialogTitle>
        <DialogContent>
          {editForm &&
            (['title', 'url', 'tags', 'frequency', 'description'] as (keyof Feed)[]).map((key) => (
              <TextField
                key={key}
                margin="normal"
                fullWidth
                label={t(`manageFeeds.fields.${key}`)}
                value={editForm[key]}
                onChange={(e) =>
                  setEditForm({ ...editForm, [key]: e.target.value })
                }
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleEditSave}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUrlModal} onClose={() => setOpenUrlModal(false)} fullWidth>
        <DialogTitle>{t('manageFeeds.addFromUrl')}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label={t('manageFeeds.feedUrl')} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUrlModal(false)}>{t('common.cancel')}</Button>
          <Button variant="contained">{t('common.add')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFileModal} onClose={() => setOpenFileModal(false)} fullWidth>
        <DialogTitle>{t('manageFeeds.addFromFile')}</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label">
            {t('manageFeeds.selectFile')}
            <input type="file" hidden accept=".xml,.opml,.json" />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFileModal(false)}>{t('common.cancel')}</Button>
          <Button variant="contained">{t('common.add')}</Button>
        </DialogActions>
      </Dialog>
      <CustomSpeedDial
  showDownload
  onDownloadClick={() => setOpenExportModal(true)}
  onAddFromUrl={() => setOpenUrlModal(true)}
  onAddFromFile={() => setOpenFileModal(true)}
/>

      <ModalWrapper
  open={openExportModal}
  onClose={() => setOpenExportModal(false)}
  component={<ExportData feeds={feeds} onClose={() => setOpenExportModal(false)} />}
/>

    </Box>
  );
};

export default ManageFeeds;
