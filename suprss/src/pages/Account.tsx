import {
  Box,
  Typography,
  Avatar,
  Stack,
  Divider,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useThemeColors } from '../component/ThemeModeContext';
import { useTranslation } from 'react-i18next';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?img=47',
  joined: 'March 2023',
  provider: 'Google',
};

const Account = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();

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
            src={mockUser.avatar}
            alt={mockUser.name}
            sx={{ width: 80, height: 80, border: `3px solid ${colors.primary}` }}
          />
          <Box flex={1}>
            <Typography variant="h6" fontWeight={600} color={colors.text.primary}>
              {mockUser.name}
            </Typography>
            <Typography variant="body2" color={colors.text.secondary}>
              {mockUser.email}
            </Typography>
            <Typography variant="body2" color={colors.text.secondary}>
              {t('pages.account.joined')}: {mockUser.joined}
            </Typography>
          </Box>
          <Tooltip title={t('pages.account.editProfile')}>
            <IconButton>
              <EditIcon sx={{ color: colors.icon }} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Divider sx={{ borderColor: colors.border }} />

        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={500} color={colors.text.primary}>
            {t('pages.account.linkedProvider')}
          </Typography>
          <TextField
            label={t('pages.account.authProvider')}
            value={mockUser.provider}
            disabled
            fullWidth
            InputProps={{ sx: { color: colors.text.primary } }}
          />
        </Stack>

        <Divider sx={{ borderColor: colors.border }} />

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
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
          >
            {t('pages.account.changePassword')}
          </Button>
          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            color="error"
            sx={{ fontWeight: 600 }}
          >
            {t('pages.account.logout')}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Account;