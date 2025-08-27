import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'intro.js/introjs.css';
import { CssBaseline } from '@mui/material'
import { ThemeModeProvider } from './component/ThemeModeContext.tsx'
import './i18n/Config.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <CssBaseline />
      <App />
    </ThemeModeProvider>
  </StrictMode>,
)
