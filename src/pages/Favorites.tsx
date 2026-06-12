import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, SlidersHorizontal } from 'lucide-react'

type SortOption = 'newest' | 'oldest' | 'az' | 'za'

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [search, setSearch] = useState(() => sessionStorage.getItem('fav_search') || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const s = sessionStorage.getItem('fav_categories')
    return s ? JSON.parse(s) : []
  })
  const [sortBy, setSortBy] = useState<SortOption>(() => (sessionStorage.getItem('fav_sort') as SortOption) || 'newest')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) setFavorites(JSON.parse(stored))
  }, [])

  useEffect(() => { sessionStorage.setItem('fav_search', search) }, [search])
  useEffect(() => { sessionStorage.setItem('fav_categories', JSON.stringify(selectedCategories)) }, [selectedCategories])
  useEffect(() => { sessionStorage.setItem('fav_sort', sortBy) }, [sortBy])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setShowFilterPanel(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const removeFavorite = (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = favorites.filter(f => f.idMeal !== mealId)
    localStorage.setItem('favorites', JSON.stringify(updated))
    setFavorites(updated)
    window.dispatchEvent(new Event('favoritesUpdated'))
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setSortBy('newest')
    sessionStorage.removeItem('fav_search')
    sessionStorage.removeItem('fav_categories')
    sessionStorage.removeItem('fav_sort')
  }

  const categories = useMemo(() => {
    const cats = favorites.map(f => f.strCategory).filter(Boolean)
    return [...new Set(cats)] as string[]
  }, [favorites])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (search.trim()) count++
    count += selectedCategories.length
    if (sortBy !== 'newest') count++
    return count
  }, [search, selectedCategories, sortBy])

  const filtered = useMemo(() => {
    let list = [...favorites]
    if (search.trim())
      list = list.filter(f => f.strMeal.toLowerCase().includes(search.toLowerCase()))
    if (selectedCategories.length > 0)
      list = list.filter(f => selectedCategories.includes(f.strCategory))
    if (sortBy === 'az') list.sort((a, b) => a.strMeal.localeCompare(b.strMeal))
    else if (sortBy === 'za') list.sort((a, b) => b.strMeal.localeCompare(a.strMeal))
    else if (sortBy === 'newest') list.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))
    else if (sortBy === 'oldest') list.sort((a, b) => (a.savedAt || 0) - (b.savedAt || 0))
    return list
  }, [favorites, search, selectedCategories, sortBy])

  return (
    <div className="page">
      <div className="favorites-header">
        <h1>Mis favoritos</h1>

        {favorites.length > 0 && (
          <div className="position-relative" ref={filterRef}>
            <button
              className={`btn btn-outline-secondary d-flex align-items-center gap-2 ${showFilterPanel ? 'active' : ''}`}
              onClick={() => setShowFilterPanel(p => !p)}
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 && (
                <span className="badge bg-primary rounded-pill">{activeFilterCount}</span>
              )}
            </button>

            {showFilterPanel && (
              <div className="filter-panel">
                <div className="filter-panel-section">
                  <span className="filter-panel-label">Buscar</span>
                  <input
                    className="filter-panel-search"
                    type="text"
                    placeholder="Nombre de receta..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                <div className="filter-panel-section">
                  <span className="filter-panel-label">Fecha</span>
                  {(['newest', 'oldest'] as const).map(opt => (
                    <label key={opt} className="filter-panel-item">
                      <input type="radio" name="sort" checked={sortBy === opt} onChange={() => setSortBy(opt)} />
                      {{ newest: 'Más recientes', oldest: 'Más antiguos' }[opt]}
                    </label>
                  ))}
                </div>

                <div className="filter-panel-section">
                  <span className="filter-panel-label">Alfabético</span>
                  {(['az', 'za'] as const).map(opt => (
                    <label key={opt} className="filter-panel-item">
                      <input type="radio" name="sort" checked={sortBy === opt} onChange={() => setSortBy(opt)} />
                      {{ az: 'A → Z', za: 'Z → A' }[opt]}
                    </label>
                  ))}
                </div>

                {categories.length > 0 && (
                  <div className="filter-panel-section">
                    <span className="filter-panel-label">Categorías</span>
                    {categories.map(cat => (
                      <label key={cat} className="filter-panel-item">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} />
                        {cat}
                      </label>
                    ))}
                  </div>
                )}

                {activeFilterCount > 0 && (
                  <button className="filter-panel-clear" onClick={clearFilters}>
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="empty">
          {favorites.length === 0 ? 'No tenés favoritos guardados todavía.' : 'No hay resultados.'}
        </p>
      )}

      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
        {filtered.map(meal => (
          <div key={meal.idMeal} className="col">
            <div
              className="card meal-card h-100"
              onClick={() => navigate(`/recipe/${meal.idMeal}`)}
            >
              <img className="card-img-top" src={meal.strMealThumb} alt={meal.strMeal} />
              <button className="meal-card-fav-btn" onClick={(e) => removeFavorite(meal.idMeal, e)}>
                <Heart className="meal-card-heart-shadow" size={22} fill="currentColor" />
                <Heart className="meal-card-heart" size={22} fill="currentColor" />
              </button>
              <div className="card-body p-2">
                <p className="card-text small fw-semibold mb-0">{meal.strMeal}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
