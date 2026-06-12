import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchCategories, fetchMealsByCategory, searchMeals } from '../services/mealDbApi'
import { categoryTranslations } from '../constants/categoryTranslations'

const categoryOrder = ['Breakfast', 'Starter', 'Pasta', 'Beef', 'Chicken', 'Seafood', 'Pork', 'Lamb', 'Goat', 'Side', 'Vegan', 'Vegetarian', 'Miscellaneous', 'Dessert']

export default function Home() {
  const [categories, setCategories] = useState<any[]>([])
  const [meals, setMeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => sessionStorage.getItem('lastCategory') || null
  )
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const categoryBarRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const scrollCategories = (dir: 'left' | 'right') => {
    const el = categoryBarRef.current
    if (!el) return
    if (dir === 'right') {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: 200, behavior: 'smooth' })
      }
    } else {
      if (el.scrollLeft <= 0) {
        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: -200, behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      const favs = JSON.parse(stored)
      setFavoriteIds(new Set(favs.map((f: any) => f.idMeal)))
    }
  }, [])

  useEffect(() => {
    fetchCategories().then(data => {
      const ordered = categoryOrder
        .map(name => data.find((c: any) => c.strCategory === name))
        .filter(Boolean)
      const rest = data.filter((c: any) => !categoryOrder.includes(c.strCategory))
      setCategories([...ordered, ...rest])
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetch = selectedCategory
      ? fetchMealsByCategory(selectedCategory)
      : searchMeals('')
    fetch.then(data => {
      setMeals(data)
      setLoading(false)
    })
  }, [selectedCategory])

  const toggleFavorite = (meal: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const stored = localStorage.getItem('favorites')
    const favs = stored ? JSON.parse(stored) : []
    if (favoriteIds.has(meal.idMeal)) {
      localStorage.setItem('favorites', JSON.stringify(favs.filter((f: any) => f.idMeal !== meal.idMeal)))
      setFavoriteIds(prev => { const next = new Set(prev); next.delete(meal.idMeal); return next })
    } else {
      favs.push({ idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb, strCategory: meal.strCategory || selectedCategory || '', savedAt: Date.now() })
      localStorage.setItem('favorites', JSON.stringify(favs))
      setFavoriteIds(prev => new Set([...prev, meal.idMeal]))
    }
    window.dispatchEvent(new Event('favoritesUpdated'))
  }

  const handleCategory = (cat: string) => {
    const next = selectedCategory === cat ? null : cat
    setSelectedCategory(next)
    next ? sessionStorage.setItem('lastCategory', next) : sessionStorage.removeItem('lastCategory')
  }

return (
    <div className="page">
      <h1 className="logo">Cookly</h1>

      <div className="category-bar-wrapper">
        <button className="category-arrow" onClick={() => scrollCategories('left')}>
          <ChevronLeft size={18} />
        </button>
        <div className="category-bar" ref={categoryBarRef}>
          {categories.map((cat: any) => (
            <button
              key={cat.strCategory}
              className={`category-btn ${selectedCategory === cat.strCategory ? 'active' : ''}`}
              onClick={() => handleCategory(cat.strCategory)}
            >
              {categoryTranslations[cat.strCategory]?.emoji} {categoryTranslations[cat.strCategory]?.label || cat.strCategory}
            </button>
          ))}
        </div>
        <button className="category-arrow" onClick={() => scrollCategories('right')}>
          <ChevronRight size={18} />
        </button>
      </div>

      <h2 className="section-title">
        {selectedCategory
          ? categoryTranslations[selectedCategory]?.label || selectedCategory
          : 'Recetas Populares'}
      </h2>

      <div className="meal-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="meal-card-skeleton">
                <div className="skeleton-img" />
                <div className="skeleton-text" />
              </div>
            ))
          : meals.map(meal => (
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
            ))
        }
      </div>
    </div>
  )
}
