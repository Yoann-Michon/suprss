import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'intro.js/introjs.css';
import { CssBaseline } from '@mui/material'
import { ThemeModeProvider } from './component/ThemeModeContext.tsx'
import './i18n/Config.ts';
import { UserProvider } from './context/UserContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <ThemeModeProvider>
        <CssBaseline />
        <App />
      </ThemeModeProvider>
    </UserProvider>
  </StrictMode>,
)
