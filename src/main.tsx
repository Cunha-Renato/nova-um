import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ConvexClerkProvider from './providers/convex_clerk.tsx'
import Auth from './components/auth/auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexClerkProvider>
      <Auth>
        <App />
      </Auth>
    </ConvexClerkProvider>
  </StrictMode>,
)
