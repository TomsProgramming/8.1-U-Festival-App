import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/global.scss'
import App from './App.tsx'
import { registerServiceWorker, capturePwaInstallPrompt } from './pwa/register'

// Capture the install-prompt event as early as possible so the in-app
// install button can fire it later (Chromium fires it once, very early).
capturePwaInstallPrompt();
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
