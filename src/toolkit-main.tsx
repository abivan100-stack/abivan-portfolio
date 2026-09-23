import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ToolkitPage from './ToolkitPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToolkitPage />
  </StrictMode>,
)
