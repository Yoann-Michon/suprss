import {
  Box,
  Typography,
  Switch,
  Paper,
} from '@mui/material';
import { useThemeColors, useThemeMode } from '../component/ThemeModeContext';

const SettingsPage= () => {
  const colors = useThemeColors();
  const { darkMode, toggleDarkMode } = useThemeMode();

  return (
    <Box p={{ xs: 2, md: 4 }} height={"100%"}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {/* Appearance Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: colors.background.paper,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">Dark Mode</Typography>
            <Typography variant="body2" color="text.secondary">
              Enable dark mode for a comfortable reading experience in low-light conditions.
            </Typography>
          </Box>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="primary"
          />
        </Box>
      </Paper>

      {/* Placeholder for future settings */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          backgroundColor: colors.background.paper,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your notification preferences (coming soon).
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
