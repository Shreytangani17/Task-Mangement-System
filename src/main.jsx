import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { warmupServer } from './utils/api.js'

// 🔥 Fire warmup IMMEDIATELY — before React even renders.
// This sends the health-check ping as early as possible so that by the time
// the user sees the login form and types their credentials, the Vercel
// serverless function + MongoDB connection are already fully awake.
warmupServer();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
