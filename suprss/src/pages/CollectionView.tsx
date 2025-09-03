// CollectionView.tsx
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Paper,
  Badge,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Share,
  MoreVert,
  Send,
  Group,
  Chat,
  PersonAdd,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useThemeColors } from "../component/ThemeModeContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api.service";
import { useArticle, type Article } from "../context/ArticleContext";
import ModalWrapper from "../component/modal/ModalWrapper";

interface Collection {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  articleIds: string[];
  collaborators: { userId: string; role: string; user?: User }[];
  ownerId: string;
  owner?: User;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  user?: User;
  message: string;
  timestamp: string;
  type: 'message' | 'system';
}

// Component pour la liste des articles
const ArticlesTab = ({ 
  articles, 
  colors, 
  t, 
  showArticle, 
  handleRemoveArticle 
}: {
  articles: Article[];
  colors: any;
  t: any;
  showArticle: (article: Article) => void;
  handleRemoveArticle: (articleId: string) => void;
}) => {
  if (articles.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: colors.background.paper }}>
        <Typography variant="h6" color={colors.text.secondary}>
          {t("pages.myFeed.emptyState.title")}
        </Typography>
        <Typography variant="body2" color={colors.text.tertiary}>
          {t("pages.myFeed.emptyState.description")}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {articles.map((article) => (
        <Card key={article.id} sx={{ bgcolor: colors.background.paper }}>
          <CardContent>
            <Typography variant="h6" gutterBottom noWrap>
              {article.title}
            </Typography>
            <Typography variant="body2" color={colors.text.secondary} sx={{ mb: 2 }}>
              {article.author} • {new Date(article.pubDate).toLocaleDateString()}
            </Typography>
            <Typography 
              variant="body2" 
              color={colors.text.tertiary}
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 2
              }}
            >
              {article.excerpt}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button 
                size="small" 
                onClick={() => showArticle(article)}
              >
                {t("pages.home.read")}
              </Button>
              <IconButton 
                size="small" 
                color="error"
                onClick={() => handleRemoveArticle(article.id)}
              >
                <Delete />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

// Component pour la liste des collaborateurs
const CollaboratorsTab = ({ 
  collection, 
  colors, 
  t, 
  onAddCollaborator 
}: {
  collection: Collection;
  colors: any;
  t: any;
  onAddCollaborator: () => void;
}) => {
  return (
    <Paper sx={{ p: 2, bgcolor: colors.background.paper }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{t("pages.settings.collections.users")}</Typography>
        <Button 
          startIcon={<PersonAdd />} 
          onClick={onAddCollaborator}
        >
          {t("common.add")} {t("pages.settings.collections.users")}
        </Button>
      </Box>
      
      <List>
        {/* Owner */}
        <ListItem>
          <ListItemAvatar>
            <Avatar src={collection.owner?.avatarUrl}>
              {collection.owner?.username?.[0] || collection.owner?.email[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={collection.owner?.username || collection.owner?.email}
            secondary="Owner"
          />
          <Chip label="Owner" color="primary" size="small" />
        </ListItem>
        
        {/* Collaborators */}
        {collection.collaborators?.map((collaborator) => (
          <ListItem key={collaborator.userId}>
            <ListItemAvatar>
              <Avatar src={collaborator.user?.avatarUrl}>
                {collaborator.user?.username?.[0] || collaborator.user?.email[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={collaborator.user?.username || collaborator.user?.email}
              secondary={collaborator.role}
            />
            <Chip label={collaborator.role} size="small" />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

// Component pour le chat
const ChatTab = ({ 
  messages, 
  currentUser, 
  newMessage, 
  setNewMessage, 
  sendMessage, 
  isConnected, 
  colors, 
  t,
  messagesEndRef 
}: {
  messages: ChatMessage[];
  currentUser: User | null;
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
  isConnected: boolean;
  colors: any;
  t: any;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Paper sx={{ height: '60vh', display: 'flex', flexDirection: 'column', bgcolor: colors.background.paper }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          {t("navigation.sidebar.chat") }
        </Typography>
        <Typography variant="caption" color={colors.text.secondary}>
          {isConnected ? "Connected" : "Disconnected"}
        </Typography>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
        {messages.map((message) => (
          <Box key={message.id} sx={{ mb: 1 }}>
            {message.type === 'system' ? (
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  color: colors.text.tertiary,
                  fontStyle: 'italic'
                }}
              >
                {message.message}
              </Typography>
            ) : (
              <Paper 
                sx={{ 
                  p: 1.5, 
                  maxWidth: '70%',
                  ml: message.userId === currentUser?.id ? 'auto' : 0,
                  bgcolor: message.userId === currentUser?.id ? colors.primary : colors.background.hover,
                  color: message.userId === currentUser?.id ? 'white' : colors.text.primary
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {message.user?.username || message.user?.email} • {formatTime(message.timestamp)}
                </Typography>
                <Typography variant="body2">
                  {message.message}
                </Typography>
              </Paper>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            size="small"
            placeholder={t("common.search") + "..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={!isConnected}
          />
          <IconButton 
            color="primary" 
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

// Component pour le modal d'ajout de collaborateur
const AddCollaboratorModal = ({ 
  newCollaboratorEmail, 
  setNewCollaboratorEmail, 
  onConfirm, 
  t 
}: {
  newCollaboratorEmail: string;
  setNewCollaboratorEmail: (email: string) => void;
  onConfirm: () => void;
  t: any;
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("common.add")} {t("pages.settings.collections.users")}
      </Typography>
      <TextField
        fullWidth
        label="Email"
        value={newCollaboratorEmail}
        onChange={(e) => setNewCollaboratorEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button variant="contained" onClick={onConfirm}>
          {t("common.add")}
        </Button>
      </Box>
    </Box>
  );
};

const CollectionView = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { showArticle } = useArticle();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  // WebSocket pour le chat temps réel
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (collectionId) {
      fetchCollectionData();
      fetchCurrentUser();
      initializeWebSocket();
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [collectionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCurrentUser = async () => {
    try {
      const user = await api<User>("/auth/profile");
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const fetchCollectionData = async () => {
    try {
      setLoading(true);
      const collectionData = await api<Collection>(`/collection/${collectionId}`);
      setCollection(collectionData);

      // Fetch articles
      if (collectionData.articleIds?.length > 0) {
        const allArticles = await api<Article[]>("/feed/articles", { method: "POST" });
        const collectionArticles = allArticles.filter(article => 
          collectionData.articleIds.includes(article.id)
        );
        setArticles(collectionArticles);
      }

      // Fetch chat messages
      await fetchMessages();
    } catch (error) {
      setError(t('error.serverError'));
      console.error("Failed to fetch collection:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const mockMessages: ChatMessage[] = [
        {
          id: "1",
          userId: "user1",
          user: { id: "user1", email: "alice@example.com", username: "Alice" },
          message: "This collection is really useful!",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'message'
        },
        {
          id: "2",
          userId: "system",
          message: "Bob joined the collection",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          type: 'system'
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const initializeWebSocket = () => {
    try {
      const wsUrl = `ws://localhost:3001/collections/${collectionId}/chat`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected");
      };

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data) as ChatMessage;
        setMessages(prev => [...prev, message]);
      };

      websocket.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected");
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      setWs(websocket);
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !ws || !currentUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    ws.send(JSON.stringify(message));
    setNewMessage("");
  };

  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail.trim()) return;

    try {
      await api(`/collection/${collectionId}/collaborators`, {
        method: 'POST',
        body: JSON.stringify({
          collaboratorUserId: newCollaboratorEmail,
          role: 'VIEWER'
        })
      });
      
      setShowAddCollaborator(false);
      setNewCollaboratorEmail("");
      await fetchCollectionData();
    } catch (error) {
      setError(t('error.serverError'));
    }
  };

  const handleRemoveArticle = async (articleId: string) => {
    try {
      await api(`/collection/${collectionId}/articles/${articleId}`, {
        method: 'DELETE'
      });
      await fetchCollectionData();
    } catch (error) {
      setError(t('error.serverError'));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>{t('loading.message')}</Typography>
      </Box>
    );
  }

  if (!collection) {
    return (
      <Box p={4}>
        <Typography color={colors.text.secondary}>
          {t("pages.home.noResults")}
        </Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          {t("common.back")}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.background.default }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 2, bgcolor: colors.background.paper }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight="bold" color={colors.text.primary}>
                {collection.name}
              </Typography>
              <Typography variant="body2" color={colors.text.secondary}>
                {collection.description}
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip 
                  label={collection.isPrivate ? t("pages.settings.collections.private") : t("pages.settings.collections.shared")}
                  size="small"
                  color={collection.isPrivate ? "default" : "primary"}
                />
                <Chip 
                  label={`${articles.length} ${t("pages.settings.collections.articles")}`}
                  size="small"
                />
                <Chip 
                  label={`${collection.collaborators?.length || 0} ${t("pages.settings.collections.users")}`}
                  size="small"
                  icon={<Group />}
                />
              </Box>
            </Box>
          </Box>
          
          <Box display="flex" gap={1}>
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: colors.background.paper }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label={t("pages.settings.collections.articles")} />
          <Tab label={t("pages.settings.collections.users")} icon={<Group />} />
          <Tab 
            label={
              <Badge badgeContent={isConnected ? "●" : "○"} color={isConnected ? "success" : "error"}>
                {t("navigation.sidebar.chat") }
              </Badge>
            } 
            icon={<Chat />} 
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {activeTab === 0 && (
          <ArticlesTab
            articles={articles}
            colors={colors}
            t={t}
            showArticle={showArticle}
            handleRemoveArticle={handleRemoveArticle}
          />
        )}

        {activeTab === 1 && (
          <CollaboratorsTab
            collection={collection}
            colors={colors}
            t={t}
            onAddCollaborator={() => setShowAddCollaborator(true)}
          />
        )}

        {activeTab === 2 && (
          <ChatTab
            messages={messages}
            currentUser={currentUser}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            isConnected={isConnected}
            colors={colors}
            t={t}
            messagesEndRef={messagesEndRef}
          />
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => { /* Handle share */ }}>
          <Share sx={{ mr: 1 }} />
          {t("common.share")}
        </MenuItem>
        <MenuItem onClick={() => { /* Handle edit */ }}>
          <Edit sx={{ mr: 1 }} />
          {t("features.manageFeeds.editFeed")}
        </MenuItem>
      </Menu>

      <ModalWrapper
        open={showAddCollaborator}
        onClose={() => setShowAddCollaborator(false)}
        component={
          <AddCollaboratorModal
            newCollaboratorEmail={newCollaboratorEmail}
            setNewCollaboratorEmail={setNewCollaboratorEmail}
            onConfirm={handleAddCollaborator}
            t={t}
          />
        }
      />

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default CollectionView;