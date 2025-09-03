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
  tags: string[];
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
    tags: [],
    description: '',
  });

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openUrlModal, setOpenUrlModal] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await api<Feed[]>('/feed');
        setFeeds(res);
      } catch {
        setError(t('features.manageFeeds.messages.errorLoad'));
      } finally {
        setLoading(false);
      }
    };
    fetchFeeds();
  }, [t]);

  const handleEditSave = async () => {
    if (!editForm?.name || !editForm.url || !editForm.frequency) {
      setError(t('features.manageFeeds.messages.missingFields') );
      return;
    }
    try {
      const updated = await api<Feed>(`/feed/${editForm.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editForm.name,
          url: editForm.url,
          frequency: editForm.frequency,
          tags: editForm.tags,
          description: editForm.description,
        }),
      });
      setFeeds(prev => prev.map(f => f.id === updated.id ? updated : f));
      setOpenEditModal(false);
      setSuccess(t('auth.api.update_success') );
    } catch {
      setError(t('features.manageFeeds.messages.errorEdit'));
    }
  };

  const handleAddFromUrl = async () => {
    if (!newFeedForm.name || !newFeedForm.url || !newFeedForm.frequency) {
      setError(t('features.manageFeeds.messages.missingFields') );
      return;
    }
    try {
      const created = await api<Feed>('/feed', {
        method: 'POST',
        body: JSON.stringify({
          name: newFeedForm.name,
          url: newFeedForm.url,
          frequency: newFeedForm.frequency,
          tags: newFeedForm.tags,
          description: newFeedForm.description,
        }),
      });
      setFeeds(prev => [...prev, created]);
      setNewFeedForm({ name:'', url:'', frequency:'Daily', tags:[], description:'' });
      setOpenUrlModal(false);
      setSuccess(t('actions.addFeed') + ' ' + t('auth.api.register_success'));
    } catch {
      setError(t('features.manageFeeds.messages.errorAdd'));
    }
  };

  const handleFileImport = async () => {
    if (!selectedFile) {
      setError(t('features.manageFeeds.selectFile'));
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/feed/import`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Import failed: ${response.status}`);
      }

      const result = await response.json();
      
      let message = `${t('actions.importFeeds')} ${t('auth.api.login_success')}: ${result.imported}/${result.total} feeds imported`;
      if (result.skipped > 0) {
        message += `, ${result.skipped} skipped`;
      }
      
      setSuccess(message);
      
      if (result.errors && result.errors.length > 0) {
        console.warn('Import errors:', result.errors);
      }

      const refreshedFeeds = await api<Feed[]>('/feed');
      setFeeds(refreshedFeeds);
      
      setOpenFileModal(false);
      setSelectedFile(null);
    } catch (error) {
      setError(`${t('actions.importFeeds')} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      await api(`/feed/${id}`, { method: 'DELETE' });
      setFeeds(prev => prev.filter(f => f.id !== id));
      setSuccess(t('auth.api.update_success') );
    } catch {
      setError(t('features.manageFeeds.messages.errorDelete'));
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('features.manageFeeds.table.feedTitle'), flex: 1 },
    { field: 'url', headerName: t('features.manageFeeds.table.url'), flex: 1 },
    { 
      field: 'tags', 
      headerName: t('features.manageFeeds.table.tags'), 
      flex: 1,
      renderCell: ({ value }) => Array.isArray(value) ? value.join(', ') : value || ''
    },
    { field: 'frequency', headerName: t('features.manageFeeds.table.updateFrequency'), width: 150 },
    { field: 'description', headerName: t('features.manageFeeds.table.description'), flex: 2 },
    {
      field: 'actions',
      headerName: t('features.manageFeeds.table.actions'),
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
        <FormControl fullWidth margin="normal" key={key}>
          <InputLabel>{t('features.manageFeeds.fields.frequency')}</InputLabel>
          <Select
            value={value}
            label={t('features.manageFeeds.fields.frequency')}
            onChange={e => onChange(e.target.value)}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Hourly">Hourly</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
          </Select>
        </FormControl>
      );
    }
    if (key === 'tags') {
      return (
        <TextField
          key={key}
          fullWidth
          margin="normal"
          label={t('features.manageFeeds.fields.tags')}
          value={Array.isArray(value) ? value.join(', ') : value}
          onChange={e => onChange(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
          helperText="Separate tags with commas"
        />
      );
    }
    return (
      <TextField
        key={key}
        fullWidth
        margin="normal"
        label={t(`features.manageFeeds.fields.${key}`) || key.charAt(0).toUpperCase() + key.slice(1)}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={key === 'name' || key === 'url'}
      />
    );
  };

  return (
    <Box p={4} sx={{ backgroundColor: colors.background.default, minHeight: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {t('features.manageFeeds.title')}
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
        <DialogTitle>{t('features.manageFeeds.editFeed')}</DialogTitle>
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
        <DialogTitle>{t('features.manageFeeds.addFromUrl')}</DialogTitle>
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
        <DialogTitle>{t('features.manageFeeds.addFromFile')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              {t('documentation.faq.a3')}
            </Typography>
            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
              {selectedFile ? selectedFile.name : t('features.manageFeeds.selectFile')}
              <input 
                type="file" 
                hidden 
                accept=".json,.csv,.opml,.xml"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </Button>
            {selectedFile && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                File size: {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenFileModal(false);
            setSelectedFile(null);
          }}>{t('common.cancel')}</Button>
          <Button 
            variant="contained" 
            onClick={handleFileImport}
            disabled={!selectedFile || uploading}
          >
            {uploading ? t('loading.message') : t('common.add')}
          </Button>
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
        open={!!success}
        autoHideDuration={5000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

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