import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { CssBaseline } from '@mui/material'
import 'leaflet/dist/leaflet.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
)
