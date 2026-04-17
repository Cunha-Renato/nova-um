import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ConvexClerkProvider from './providers/convex_clerk.tsx'
import Auth from './components/auth/auth.tsx'
import { Sidebar } from './components/sidebar.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './lib/routes.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexClerkProvider>
        <Auth>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <Routes>
                {ROUTES.map(({ href, page: Page }) => (
                  <Route key={href} path={href} element={<Page />} />
                ))}
              </Routes>
            </main>
          </div>
        </Auth>
      </ConvexClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)