import {
  Box,
  Typography,
  Avatar,
  Stack,
  Divider,
  Button,
  TextField,
  Paper,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useThemeColors } from '../component/ThemeModeContext';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { api } from '../services/api.service';

const Account = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { user, refreshUser, logout } = useUser();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await api(`/users/me`, {
        method: 'PATCH',
        body: JSON.stringify({ username, email, password, avatarUrl }),
      });
      await refreshUser();
      setPassword('');
      setEditing(false);
    } catch (err: any) {
      alert(err.message || t('error.serverError'));
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('pages.account.confirmDelete'))) return;
    try {
      await api(`/users/${user?.id}`, { method: 'DELETE' });
      logout();
    } catch (err: any) {
      alert(err.message || t('error.serverError'));
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">{t('error.unauthorized')}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
        backgroundColor: colors.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 720,
          p: 4,
          borderRadius: 4,
          backgroundColor: colors.background.paper,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} color={colors.text.primary}>
          {t('pages.account.title')}
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            src={avatarUrl}
            alt={username}
            sx={{ width: 80, height: 80, border: `3px solid ${colors.primary}` }}
          />
          <Box flex={1}>
            {editing ? (
              <>
                <TextField
                  label={t('auth.register.username')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label={t('auth.email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label={t('auth.password')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="dense"
                />
              </>
            ) : (
              <>
                <Typography variant="h6" fontWeight={600} color={colors.text.primary}>
                  {username}
                </Typography>
                <Typography variant="body2" color={colors.text.secondary}>
                  {email}
                </Typography>
              </>
            )}
          </Box>
        </Stack>

        <Divider sx={{ borderColor: colors.border }} />

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
          {editing && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              {t('common.save')}
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            sx={{ fontWeight: 600 }}
            onClick={logout}
          >
            {t('pages.account.logout')}
          </Button>
          {!editing && (
            <Button
              variant="outlined"
              onClick={() => setEditing(true)}
            >
              {t('pages.account.editProfile')}
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            {t('pages.account.deleteAccount')}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Account;
