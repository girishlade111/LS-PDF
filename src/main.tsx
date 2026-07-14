import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

// Dev-only error logger (never fires alerts in production)
if (import.meta.env.DEV) {
  window.onerror = function(msg, _url, line, _col, error) {
    console.error("[DEV] Uncaught error:", msg, "Line:", line, error);
    return false;
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
