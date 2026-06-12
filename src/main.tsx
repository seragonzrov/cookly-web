import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/variables.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/navbar.css'
import './styles/cards.css'
import './styles/search.css'
import './styles/detail.css'
import './styles/favorites.css'
import './styles/landing.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)