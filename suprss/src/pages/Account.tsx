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
import LockResetIcon from '@mui/icons-material/LockReset';
import { useThemeColors } from '../component/ThemeModeContext';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { api } from '../services/api.service';

const Account = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { user, refreshUser, logout } = useUser();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  async function handleSave() {
    try {
      await api(`/users/${user?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          username,
          email,
          avatarUrl
        }),
      });
      await refreshUser();
      setEditing(false);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour');
    }
  }

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
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Avatar URL"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
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

        <Divider sx={{ borderColor: colors.border }} />

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
          {editing && (
            <Button
              variant="outlined"
              startIcon={<LockResetIcon />}
              sx={{
                color: colors.primary,
                borderColor: colors.primary,
                '&:hover': {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + '10',
                },
              }}
              onClick={handleSave}
            >
              {t('common.save')}
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            color="error"
            sx={{ fontWeight: 600 }}
            onClick={logout}
          >
            {t('pages.account.logout')}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Account;
