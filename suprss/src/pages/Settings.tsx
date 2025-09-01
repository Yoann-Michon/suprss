import {
  Box,
  Typography,
  Switch,
  Paper,
} from '@mui/material';
import { useThemeColors, useThemeMode } from '../component/ThemeModeContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../component/LanguageSelector';

const SettingsPage = () => {
  const colors = useThemeColors();
  const { darkMode, toggleDarkMode } = useThemeMode();
  const { t } = useTranslation();

  return (
    <Box p={{ xs: 2, md: 4 }} height="100%">
      <Typography variant="h4" gutterBottom>
        {t('pages.settings.title')}
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: colors.background.paper,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h6">{t('pages.settings.appearance.darkMode')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('pages.settings.appearance.darkModeDescription')}
            </Typography>
          </Box>
          <Switch checked={darkMode} onChange={toggleDarkMode} color="primary" />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{t('pages.settings.appearance.language')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('pages.settings.appearance.languageDescription')}
            </Typography>
          </Box>
          <LanguageSelector />
        </Box>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          backgroundColor: colors.background.paper,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {t('pages.settings.notifications.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('pages.settings.notifications.description')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
