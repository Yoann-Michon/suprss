import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Chip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useThemeColors } from "../component/ThemeModeContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { api } from "../services/api.service";
import { useArticle, type Article } from "../context/ArticleContext";

interface Collection {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  articleIds: string[];
  collaborators: { userId: string; role: string }[];
  ownerId: string;
}

interface User {
  id: string;
  email: string;
  username?: string;
}

const ManageCollection = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { showArticle } = useArticle();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PRIVATE" | "SHARED">("ALL");
  const [openModal, setOpenModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIsPrivate, setNewIsPrivate] = useState(true);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCollections(),
        fetchArticles(),
        fetchUsers()
      ]);
    } catch (error) {
      setError(t('error.serverError'));
    } finally {
      setLoading(false);
    }
  };

  async function fetchCollections() {
    try {
      const collections = await api<Collection[]>("/collection");
      setCollections(collections);
    } catch (err: any) {
      console.error("Error loading collections", err);
      setError(t('features.manageFeeds.messages.errorLoad'));
    }
  }

  async function fetchArticles() {
    try {
      const data = await api<Article[]>("/feed/articles", { method: "POST" });
      setAllArticles(data);
    } catch (error) {
      console.error("Error loading articles", error);
    }
  }

  async function fetchUsers() {
    try {
      const data = await api<User[]>("/users");
      setAllUsers(data);
    } catch (error) {
      console.error("Error loading users", error);
    }
  }

  const openCreateModal = () => {
    setEditingCollection(null);
    setNewName("");
    setNewDescription("");
    setNewIsPrivate(true);
    setSelectedArticles([]);
    setSelectedUsers([]);
    setOpenModal(true);
  };

  const openEditModal = (collection: Collection) => {
    setEditingCollection(collection);
    setNewName(collection.name);
    setNewDescription(collection.description || "");
    setNewIsPrivate(collection.isPrivate);
    setSelectedArticles(collection.articleIds || []);
    setSelectedUsers(collection.collaborators?.map(c => c.userId) || []);
    setOpenModal(true);
  };

  async function handleSaveCollection() {
    if (!newName.trim()) {
      setError(t('features.manageFeeds.messages.missingFields'));
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const collectionData = {
        name: newName.trim(),
        description: newDescription.trim() || undefined,
        isPrivate: newIsPrivate,
        articleIds: selectedArticles,
        collaborators: !newIsPrivate ? selectedUsers.map(userId => ({ userId, role: 'VIEWER' })) : [],
      };

      if (editingCollection) {
        await api(`/collection/${editingCollection.id}`, {
          method: 'PATCH',
          body: JSON.stringify(collectionData),
        });
        setSuccess(t('success.feedUpdated'));
      } else {
        await api("/collection", {
          method: "POST",
          body: JSON.stringify(collectionData),
        });
        setSuccess(t('success.feedAdded') );
      }

      setOpenModal(false);
      resetForm();
      await fetchCollections();
    } catch (err: any) {
      setError(err.message || t('error.serverError'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteCollection(collectionId: string) {
    if (!confirm(t('common.cancel') + '?')) return;

    try {
      await api(`/collection/${collectionId}`, { method: 'DELETE' });
      setSuccess(t('success.feedDeleted'));
      await fetchCollections();
    } catch (err: any) {
      setError(err.message || t('features.manageFeeds.messages.errorDelete'));
    }
  }

  const resetForm = () => {
    setNewName("");
    setNewDescription("");
    setNewIsPrivate(true);
    setSelectedArticles([]);
    setSelectedUsers([]);
    setEditingCollection(null);
  };

  const getFilteredCollections = () => {
    if (filter === "ALL") return collections;
    if (filter === "PRIVATE") return collections.filter(c => c.isPrivate);
    if (filter === "SHARED") return collections.filter(c => !c.isPrivate);
    return collections;
  };

  const getArticleTitle = (articleId: string) => {
    return allArticles.find(a => a.id === articleId)?.title || 'Unknown Article';
  };

  const getUserEmail = (userId: string) => {
    return allUsers.find(u => u.id === userId)?.email || 'Unknown User';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t('loading.message')}</Typography>
      </Box>
    );
  }

  const filteredCollections = getFilteredCollections();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        backgroundColor: colors.background.default,
        position: "relative",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600} color={colors.text.primary}>
          {t("pages.settings.collections.title")}
        </Typography>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          size="small"
          sx={{ bgcolor: colors.background.paper, minWidth: 150 }}
        >
          <MenuItem value="ALL">{t("pages.settings.collections.filterAll")}</MenuItem>
          <MenuItem value="PRIVATE">{t("pages.settings.collections.filterPrivate")}</MenuItem>
          <MenuItem value="SHARED">{t("pages.settings.collections.filterShared")}</MenuItem>
        </Select>
      </Stack>

      {filteredCollections.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color={colors.text.secondary} gutterBottom>
            {t("pages.sharedCollections.emptyState.title")}
          </Typography>
          <Typography variant="body2" color={colors.text.tertiary}>
            {t("pages.sharedCollections.emptyState.description")}
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal} sx={{ mt: 2 }}>
            {t("pages.settings.collections.new")}
          </Button>
        </Box>
      ) : (
        <Stack spacing={3} direction="row" flexWrap="wrap">
          {filteredCollections.map((col) => (
            <Card
              key={col.id}
              sx={{
                minWidth: 280,
                maxWidth: 340,
                bgcolor: colors.background.paper,
                borderRadius: 3,
                boxShadow: 2,
                m: 1,
                flex: "1 1 300px",
                border: `1px solid ${colors.background.hover}`,
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                  <Typography variant="h6" color={colors.text.primary} fontWeight={600}>
                    {col.name}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => openEditModal(col)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteCollection(col.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color={colors.text.secondary} mb={2}>
                  {col.description || t('common.description')}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                  <Chip
                    icon={<ArticleIcon />}
                    label={`${col.articleIds?.length || 0} ${t("pages.settings.collections.articles")}`}
                    size="small"
                    sx={{ bgcolor: `${colors.primary}15`, color: colors.primary }}
                  />
                  <Chip
                    icon={<GroupIcon />}
                    label={`${col.collaborators?.length || 0} ${t("pages.settings.collections.users")}`}
                    size="small"
                    sx={{ bgcolor: `${colors.primary}15`, color: colors.primary }}
                  />
                  <Chip
                    label={col.isPrivate ? t("pages.settings.collections.private") : t("pages.settings.collections.shared")}
                    size="small"
                    color={col.isPrivate ? "default" : "primary"}
                  />
                </Stack>

                {col.articleIds && col.articleIds.length > 0 && (
                  <Box>
                    <Typography variant="caption" color={colors.text.tertiary} gutterBottom>
                      {t("pages.settings.collections.articles")}:
                    </Typography>
                    {col.articleIds.slice(0, 2).map(articleId => (
                      <Typography key={articleId} variant="caption" display="block" color={colors.text.secondary}>
                        • {getArticleTitle(articleId)}
                      </Typography>
                    ))}
                    {col.articleIds.length > 2 && (
                      <Typography variant="caption" color={colors.text.tertiary}>
                        +{col.articleIds.length - 2} more
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
        }}
        onClick={openCreateModal}
      >
        <AddIcon />
      </Fab>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {editingCollection ? t("features.manageFeeds.editFeed") : t("pages.settings.collections.new")}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label={t("pages.settings.collections.newName")}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              required
              error={!newName.trim()}
              helperText={!newName.trim() ? t('features.manageFeeds.messages.missingFields') : ''}
            />
            
            <TextField
              label={t("pages.settings.collections.description")}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="Optional description for this collection..."
            />
            
            <FormControl fullWidth>
              <InputLabel>{t("pages.settings.collections.visibility")}</InputLabel>
              <Select
                value={newIsPrivate ? "PRIVATE" : "SHARED"}
                label={t("pages.settings.collections.visibility")}
                onChange={(e) => setNewIsPrivate(e.target.value === "PRIVATE")}
              >
                <MenuItem value="PRIVATE">{t("pages.settings.collections.private")}</MenuItem>
                <MenuItem value="SHARED">{t("pages.settings.collections.shared")}</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t("pages.settings.collections.selectArticles")}</InputLabel>
              <Select
                multiple
                value={selectedArticles}
                onChange={(e) => setSelectedArticles(e.target.value as string[])}
                input={<OutlinedInput label={t("pages.settings.collections.selectArticles")} />}
                renderValue={(selected) => `${selected.length} ${t("pages.settings.collections.articles")} selected`}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                {allArticles.map((article) => (
                  <MenuItem key={article.id} value={article.id}>
                    <Checkbox checked={selectedArticles.indexOf(article.id) > -1} />
                    <ListItemText
                      primary={article.title}
                      secondary={new Date(article.pubDate).toLocaleDateString()}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!newIsPrivate && (
              <FormControl fullWidth>
                <InputLabel>{t("pages.settings.collections.selectUsers")}</InputLabel>
                <Select
                  multiple
                  value={selectedUsers}
                  onChange={(e) => setSelectedUsers(e.target.value as string[])}
                  input={<OutlinedInput label={t("pages.settings.collections.selectUsers")} />}
                  renderValue={(selected) => `${selected.length} ${t("pages.settings.collections.users")} selected`}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {allUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Checkbox checked={selectedUsers.indexOf(user.id) > -1} />
                      <ListItemText 
                        primary={user.username || user.email} 
                        secondary={user.email}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveCollection}
            disabled={submitting || !newName.trim()}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
          >
            {submitting ? t('loading.processing') : (editingCollection ? t("common.save") : t("common.add"))}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={5000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageCollection;