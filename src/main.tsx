import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import React from 'react'
import 'normalize.css';


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <MantineProvider >
    <App />
  </MantineProvider>
</React.StrictMode>,
)
