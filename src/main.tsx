import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UnderwritingProvider } from './contexts/UnderwritingContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UnderwritingProvider>
      <App />
    </UnderwritingProvider>
  </StrictMode>,
)
