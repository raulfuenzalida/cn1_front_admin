import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/variables.css'
import './styles/global.css'
import './styles/bootstrap-overrides.css'
import './styles/components.css'
import AppRoutes from './routes/AppRoutes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
