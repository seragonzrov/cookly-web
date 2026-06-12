import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, Heart, Moon, Sun } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [favCount, setFavCount] = useState(0)
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true')

  const readFavCount = () => {
    const stored = localStorage.getItem('favorites')
    setFavCount(stored ? JSON.parse(stored).length : 0)
  }

  useEffect(() => {
    readFavCount()
    window.addEventListener('favoritesUpdated', readFavCount)
    return () => window.removeEventListener('favoritesUpdated', readFavCount)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    localStorage.setItem('darkMode', String(dark))
  }, [dark])

  const links = [
    { path: '/', label: 'Inicio', icon: <Home size={22} /> },
    { path: '/search', label: 'Buscar', icon: <Search size={22} /> },
    {
      path: '/favorites',
      label: 'Favoritos',
      icon: (
        <span className="nav-heart-wrapper">
          <Heart size={22} />
          {favCount > 0 && <span className="nav-fav-badge">{favCount}</span>}
        </span>
      )
    },
  ]

  return (
    <nav className="side-nav">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Cookly" className="navbar-img" />
        <span className="nav-label">Cookly</span>
      </div>

      {links.map(link => (
        <button
          key={link.path}
          className={`nav-btn ${location.pathname === link.path ? 'active' : ''}`}
          onClick={() => navigate(link.path)}
        >
          <span className="nav-icon">{link.icon}</span>
          <span className="nav-label">{link.label}</span>
        </button>
      ))}

      <div className="nav-spacer" />

      <button className="nav-btn" onClick={() => setDark(d => !d)}>
        <span className="nav-icon">
          {dark ? <Sun size={22} /> : <Moon size={22} />}
        </span>
        <span className="nav-label">{dark ? 'Modo claro' : 'Modo oscuro'}</span>
      </button>
    </nav>
  )
}
