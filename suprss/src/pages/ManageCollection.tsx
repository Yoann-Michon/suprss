import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardActions,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import { useThemeColors } from "../component/ThemeModeContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { api } from "../services/api.service";
import { useArticle, type Article } from "../context/ArticleContext";

interface Collection {
  id: string;
  name: string;
  description?: string;
  visibility: "PRIVATE" | "SHARED";
  articles: number;
  users: string[];
}

interface User {
  id: string;
  email: string;
}

const ManageCollection = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { showArticle } = useArticle();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PRIVATE" | "SHARED">("ALL");
  const [openModal, setOpenModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newVisibility, setNewVisibility] = useState<"PRIVATE" | "SHARED">("PRIVATE");
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchCollections();
    fetchArticles();
    fetchUsers();
  }, []);

  async function fetchCollections() {
    try {
      const owned = await api<Collection[]>("/api/v1/collection/owned");
      const collaborated = await api<Collection[]>("/api/v1/collection/collaborated");
      setCollections([...owned, ...collaborated]);
    } catch (err: any) {
      console.error("Erreur chargement collections", err);
    }
  }

  async function fetchArticles() {
    try {
      const data = await api<Article[]>("/api/v1/articles");
      setAllArticles(data);
    } catch {}
  }

  async function fetchUsers() {
    try {
      const data = await api<User[]>("/api/v1/users");
      setAllUsers(data);
    } catch {}
  }

  async function handleCreateCollection() {
    if (!newName) return;
    try {
      await api("/api/v1/collection", {
        method: "POST",
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          visibility: newVisibility,
          articles: selectedArticles,
          users: newVisibility === "SHARED" ? selectedUsers : [],
        }),
      });
      setOpenModal(false);
      setNewName("");
      setNewDescription("");
      setNewVisibility("PRIVATE");
      setSelectedArticles([]);
      setSelectedUsers([]);
      fetchCollections();
    } catch (err: any) {
      alert(err.message);
    }
  }

  const filtered = filter === "ALL" ? collections : collections.filter((c) => c.visibility === filter);

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

      <Stack spacing={3} direction="row" flexWrap="wrap">
        {filtered.map((col) => (
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
            }}
          >
            <CardContent>
              <Typography variant="h6" color={colors.text.primary} fontWeight={600}>
                {col.name}
              </Typography>
              <Typography variant="body2" color={colors.text.secondary} mb={1}>
                {col.description || ""}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <Chip
                  icon={<ArticleIcon />}
                  label={`${col.articles} ${t("pages.settings.collections.articles")}`}
                  size="small"
                />
                <Chip
                  icon={<GroupIcon />}
                  label={`${col.users.length} ${t("pages.settings.collections.users")}`}
                  size="small"
                />
                <Chip
                  label={t(`pages.settings.collections.${col.visibility.toLowerCase()}`)}
                  size="small"
                  color={col.visibility === "SHARED" ? "primary" : "default"}
                />
              </Stack>
            </CardContent>
            <CardActions>
              {/* Ajoute ici des boutons d'action si besoin */}
            </CardActions>
          </Card>
        ))}
      </Stack>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
        }}
        onClick={() => setOpenModal(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t("pages.settings.collections.new")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label={t("pages.settings.collections.newName")}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t("pages.settings.collections.description")}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>{t("pages.settings.collections.visibility")}</InputLabel>
              <Select
                value={newVisibility}
                label={t("pages.settings.collections.visibility")}
                onChange={(e) => setNewVisibility(e.target.value as "PRIVATE" | "SHARED")}
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
                renderValue={(selected) =>
                  allArticles
                    .filter((a) => selected.includes(a.id))
                    .map((a) => a.title)
                    .join(", ")
                }
              >
                {allArticles.map((article) => (
                  <MenuItem key={article.id} value={article.id}>
                    <Checkbox checked={selectedArticles.indexOf(article.id) > -1} />
                    <ListItemText
                      primary={
                        <span
                          style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => showArticle(article, allArticles)}
                        >
                          {article.title}
                        </span>
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {newVisibility === "SHARED" && (
              <FormControl fullWidth>
                <InputLabel>{t("pages.settings.collections.selectUsers")}</InputLabel>
                <Select
                  multiple
                  value={selectedUsers}
                  onChange={(e) => setSelectedUsers(e.target.value as string[])}
                  input={<OutlinedInput label={t("pages.settings.collections.selectUsers")} />}
                  renderValue={(selected) =>
                    allUsers
                      .filter((u) => selected.includes(u.id))
                      .map((u) => u.email)
                      .join(", ")
                  }
                >
                  {allUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Checkbox checked={selectedUsers.indexOf(user.id) > -1} />
                      <ListItemText primary={user.email} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>{t("common.cancel")}</Button>
          <Button variant="contained" onClick={handleCreateCollection}>
            {t("common.add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCollection;
