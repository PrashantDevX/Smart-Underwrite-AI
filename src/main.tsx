import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UnderwritingProvider } from './contexts/UnderwritingContext'
import ErrorBoundary from './components/ErrorBoundary'
import { registerGlobalErrorHandlers } from './utils/errorHandlers'

registerGlobalErrorHandlers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <UnderwritingProvider>
        <App />
      </UnderwritingProvider>
    </ErrorBoundary>
  </StrictMode>,
)
