import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Définition des couleurs pour chaque mode
const COLORS = {
  light: {
    // Couleurs de fond
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
      sidebar: '#F8F9FA',
      selected: '#E3F2FD',
      hover: 'rgba(61, 153, 245, 0.05)',
    },
    // Couleurs de texte
    text: {
      primary: '#000000',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
    // Couleurs d'interface
    border: '#E5E7EB',
    divider: '#E5E7EB',
    icon: '#6B7280',
    iconSelected: '#3D99F5',
    // Couleurs d'état
    primary: '#3D99F5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  dark: {
    // Couleurs de fond
    background: {
      default: '#121A21',
      paper: '#1A2027',
      sidebar: '#121A21',
      selected: '#243347',
      hover: 'rgba(61, 153, 245, 0.1)',
    },
    // Couleurs de texte
    text: {
      primary: '#FFFFFF',
      secondary: '#E2E8F0',
      tertiary: '#99ABC2',
    },
    // Couleurs d'interface
    border: '#243347',
    divider: '#243347',
    icon: '#99ABC2',
    iconSelected: '#3D99F5',
    // Couleurs d'état
    primary: '#3D99F5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

interface ThemeColors {
  background: {
    default: string;
    paper: string;
    sidebar: string;
    selected: string;
    hover: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  border: string;
  divider: string;
  icon: string;
  iconSelected: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
}

interface ThemeModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  colors: ThemeColors;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const [darkMode, setDarkMode] = useState(prefersDarkMode);


  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const colors = useMemo(() => {
    return darkMode ? COLORS.dark : COLORS.light;
  }, [darkMode]);

  // Thème Material-UI
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: colors.primary,
          },
          background: {
            default: colors.background.default,
            paper: colors.background.paper,
          },
          text: {
            primary: colors.text.primary,
            secondary: colors.text.secondary,
          },
          divider: colors.divider,
          success: {
            main: colors.success,
          },
          warning: {
            main: colors.warning,
          },
          error: {
            main: colors.error,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: colors.background.default,
                color: colors.text.primary,
                transition: 'background-color 0.3s ease, color 0.3s ease',
              },
            },
          },
        },
      }),
    [darkMode, colors]
  );

  return (
    <ThemeModeContext.Provider value={{ darkMode, toggleDarkMode, colors }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
};

export const useThemeColors = () => {
  const { colors } = useThemeMode();
  return colors;
};