import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import RecipeDetail from './pages/RecipeDetail'
import Landing from './pages/Landing'
import Navbar from './components/Navbar'

function App() {
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('hasVisited'))

  const handleDismiss = () => {
    localStorage.setItem('hasVisited', 'true')
    setShowWelcome(false)
  }

  if (showWelcome) return <Landing onDismiss={handleDismiss} />

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App