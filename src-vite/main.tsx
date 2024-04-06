import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoadDing from './loading.tsx'
const App = lazy(() => import('./view/home/App.tsx'))
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }
])
createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<LoadDing />}>
    <RouterProvider router={router} />
  </Suspense>
)
