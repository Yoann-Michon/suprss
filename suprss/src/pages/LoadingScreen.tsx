import { Box, Typography} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../component/ThemeModeContext';
import { shineAnimation } from '../component/animation/Animations';

const LoadingScreen = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{
        backgroundColor: colors.background.default,
        color: colors.text.primary,
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h6">
        {t('loading.message')}
      </Typography>
      <Typography
      variant="h3"
      sx={{
        fontSize: { xs: '36px', md: '50px' },
        fontWeight: 'bold',
        fontFamily: 'Baggy Regular',
        letterSpacing: '7px',
        textTransform: 'uppercase',
        cursor: 'default',
        ...shineAnimation,
      }}
    >
      SUPRSS
    </Typography>
    </Box>
  );
};

export default LoadingScreen;
