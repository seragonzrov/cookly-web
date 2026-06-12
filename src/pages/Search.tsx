import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Shuffle } from 'lucide-react'
import { searchMeals, fetchRandomMeal } from '../services/mealDbApi'

export default function Search() {
  const [query, setQuery] = useState('')
  const [meals, setMeals] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      const favs = JSON.parse(stored)
      setFavoriteIds(new Set(favs.map((f: any) => f.idMeal)))
    }
  }, [])

  const toggleFavorite = (meal: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const stored = localStorage.getItem('favorites')
    const favs = stored ? JSON.parse(stored) : []
    if (favoriteIds.has(meal.idMeal)) {
      localStorage.setItem('favorites', JSON.stringify(favs.filter((f: any) => f.idMeal !== meal.idMeal)))
      setFavoriteIds(prev => { const next = new Set(prev); next.delete(meal.idMeal); return next })
    } else {
      favs.push({ idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb, strCategory: meal.strCategory || '', savedAt: Date.now() })
      localStorage.setItem('favorites', JSON.stringify(favs))
      setFavoriteIds(prev => new Set([...prev, meal.idMeal]))
    }
    window.dispatchEvent(new Event('favoritesUpdated'))
  }

const handleRandom = async () => {
    const meal = await fetchRandomMeal()
    if (meal) navigate(`/recipe/${meal.idMeal}`)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    const results = await searchMeals(query)
    setMeals(results || [])
    setHasSearched(true)
  }

  return (
    <div className="page">
      <div className="search-page-header">
        <h1>Buscar recetas</h1>
        <div className="random-hint">
          <span>¿No sabés qué buscar?</span>
          <button className="random-hint-btn" onClick={handleRandom}>
            <Shuffle size={14} /> Sorprendeme
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Buscar receta..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {hasSearched && meals.length === 0 && <p className="empty">No hay resultados.</p>}

      <div className="meal-grid">
        {meals.map(meal => (
          <div
            key={meal.idMeal}
            className="meal-card"
            onClick={() => navigate(`/recipe/${meal.idMeal}`)}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <button className="meal-card-fav-btn" onClick={(e) => toggleFavorite(meal, e)}>
              {favoriteIds.has(meal.idMeal) ? (
                <>
                  <Heart className="meal-card-heart-shadow" size={22} fill="currentColor" />
                  <Heart className="meal-card-heart" size={22} fill="currentColor" />
                </>
              ) : (
                <Heart className="meal-card-heart meal-card-heart--outline" size={22} fill="none" />
              )}
            </button>
            <p>{meal.strMeal}</p>
          </div>
        ))}
      </div>
    </div>
  )
}