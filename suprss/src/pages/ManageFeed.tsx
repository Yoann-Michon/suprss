import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton,
  Paper, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useThemeColors } from '../component/ThemeModeContext';
import { useTranslation } from 'react-i18next';
import CustomSpeedDial from '../component/CustomSpeedDial';
import ModalWrapper from '../component/modal/ModalWrapper';
import ExportData from '../component/modal/ExportData';
import { api } from '../services/api.service';

export interface Feed {
  id?: string;
  name: string;        
  url: string;
  tags: string;
  frequency: 'Daily' | 'Hourly' | 'Weekly';
  description: string;
}

const ManageFeeds = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();

  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);

  const [editForm, setEditForm] = useState<Feed | null>(null);
  const [newFeedForm, setNewFeedForm] = useState<Feed>({
    name: '',
    url: '',
    frequency: 'Daily',
    tags: '',
    description: '',
  });

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openUrlModal, setOpenUrlModal] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await api<Feed[]>('/feed');
        setFeeds(res);
      } catch {
        setError(t('manageFeeds.messages.errorLoad'));
      } finally {
        setLoading(false);
      }
    };
    fetchFeeds();
  }, []);

  const handleEditSave = async () => {
    if (!editForm?.name || !editForm.url || !editForm.frequency) {
      setError(t('manageFeeds.messages.missingFields'));
      return;
    }
    try {
      const updated = await api<Feed>(`/feed/${editForm.id}`, {
        method: 'PATCH',
        body: JSON.stringify(editForm),
      });
      setFeeds(prev =>
        prev.map(f => f.id === updated.id ? updated : f)
      );
      setOpenEditModal(false);
    } catch {
      setError(t('manageFeeds.messages.errorEdit'));
    }
  };

  const handleAddFromUrl = async () => {
    if (!newFeedForm.name || !newFeedForm.url || !newFeedForm.frequency) {
      setError(t('manageFeeds.messages.missingFields'));
      return;
    }
    try {
      const created = await api<Feed>('/feed', {
        method: 'POST',
        body: JSON.stringify(newFeedForm),
      });
      setFeeds(prev => [...prev, created]);
      setNewFeedForm({ name:'', url:'', frequency:'Daily', tags:'', description:'' });
      setOpenUrlModal(false);
    } catch {
      setError(t('manageFeeds.messages.errorAdd'));
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      await api(`/feed/${id}`, { method: 'DELETE' });
      setFeeds(prev => prev.filter(f => f.id !== id));
    } catch {
      setError(t('manageFeeds.messages.errorDelete'));
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('manageFeeds.table.feedTitle'), flex: 1 },
    { field: 'url', headerName: t('manageFeeds.table.url'), flex: 1 },
    { field: 'tags', headerName: t('manageFeeds.table.tags'), flex: 1 },
    { field: 'frequency', headerName: t('manageFeeds.table.updateFrequency'), width: 150 },
    { field: 'description', headerName: t('manageFeeds.table.description'), flex: 2 },
    {
      field: 'actions',
      headerName: t('manageFeeds.table.actions'),
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => { setEditForm(row); setOpenEditModal(true); }}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const renderTextFieldOrSelect = (key: keyof Feed, value: any, onChange: (v: any) => void) => {
    if (key === 'frequency') {
      return (
        <FormControl fullWidth margin="normal">
          <InputLabel>{t(`manageFeeds.fields.frequency`)}</InputLabel>
          <Select
            value={value}
            label={t(`manageFeeds.fields.frequency`)}
            onChange={e => onChange(e.target.value)}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Hourly">Hourly</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
          </Select>
        </FormControl>
      );
    }
    return (
      <TextField
        fullWidth
        margin="normal"
        label={t(`manageFeeds.fields.${key}`)}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  };

  return (
    <Box p={4} sx={{ backgroundColor: colors.background.default, minHeight: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {t('manageFeeds.title')}
      </Typography>

      <Paper sx={{ height: 500, backgroundColor: colors.background.paper }}>
        <DataGrid
          rows={feeds}
          columns={columns}
          loading={loading}
          getRowId={row => row.id || row.name}
          disableRowSelectionOnClick
          sx={{
            height: '100%', width: '100%',
            border: 'none',
            '& .MuiDataGrid-cell': { color: colors.text.primary },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.background.hover },
          }}
        />
      </Paper>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth>
        <DialogTitle>{t('manageFeeds.editFeed')}</DialogTitle>
        <DialogContent>
          {editForm && (['name','url','tags','frequency','description'] as (keyof Feed)[]).map(key =>
            renderTextFieldOrSelect(key, editForm[key], val => setEditForm({...editForm, [key]: val}))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleEditSave}>{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUrlModal} onClose={() => setOpenUrlModal(false)} fullWidth>
        <DialogTitle>{t('manageFeeds.addFromUrl')}</DialogTitle>
        <DialogContent>
          {(['name','url','frequency','tags','description'] as (keyof Feed)[]).map(key =>
            renderTextFieldOrSelect(key, newFeedForm[key], val => setNewFeedForm({...newFeedForm, [key]: val}))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUrlModal(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleAddFromUrl}>{t('common.add')}</Button>
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

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageFeeds;
