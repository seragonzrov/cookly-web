import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { fetchMealById } from '../services/mealDbApi'
import { categoryTranslations } from '../constants/categoryTranslations'
import { areaTranslations } from '../constants/areaTranslations'

export default function RecipeDetail() {
  const { id } = useParams()
  const [meal, setMeal] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchMealById(id!).then(setMeal)
  }, [id])

  useEffect(() => {
    if (!meal) return
    const stored = localStorage.getItem('favorites')
    const favs = stored ? JSON.parse(stored) : []
    setIsFavorite(favs.some((f: any) => f.idMeal === meal.idMeal))
  }, [meal])

  const toggleFavorite = () => {
    const stored = localStorage.getItem('favorites')
    const favs = stored ? JSON.parse(stored) : []
    if (isFavorite) {
      localStorage.setItem('favorites', JSON.stringify(favs.filter((f: any) => f.idMeal !== meal.idMeal)))
      setIsFavorite(false)
    } else {
      favs.push({ idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb, strCategory: meal.strCategory || '', savedAt: Date.now() })
      localStorage.setItem('favorites', JSON.stringify(favs))
      setIsFavorite(true)
    }
    window.dispatchEvent(new Event('favoritesUpdated'))
  }

  const getIngredients = () => {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const name = meal[`strIngredient${i}`]?.trim()
      const measure = meal[`strMeasure${i}`]?.trim()
      if (name) ingredients.push({ name, measure: measure || '' })
    }
    return ingredients
  }

  const getSteps = () => {
    if (!meal?.strInstructions) return []
    return meal.strInstructions
      .split(/\r?\n/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
  }

  if (!meal) return <div className="page"><p>Cargando...</p></div>

  const categoryInfo = categoryTranslations[meal.strCategory]
  const areaLabel = meal.strArea ? areaTranslations[meal.strArea] || meal.strArea : null

  return (
    <div className="page detail">
      <div className="detail-img-wrapper">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="detail-img" />
        {(categoryInfo || areaLabel) && (
          <div className="detail-img-badges">
            {categoryInfo && <span className="badge bg-primary detail-img-badge">{categoryInfo.emoji} {categoryInfo.label}</span>}
            {areaLabel && <span className="badge bg-primary detail-img-badge">{areaLabel}</span>}
          </div>
        )}
      </div>

      <div className="detail-header">
        <h1>{meal.strMeal}</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2 flex-shrink-0" onClick={toggleFavorite}>
          <Heart size={15} fill={isFavorite ? '#fff' : 'none'} />
          {isFavorite ? 'Guardado' : 'Guardar'}
        </button>
      </div>

      <h2 className="detail-section-title">Ingredientes</h2>
      <ul className="ingredient-list">
        {getIngredients().map(({ name, measure }, i) => (
          <li key={i} className="ingredient-item">
            <span className="ingredient-bullet" />
            <span className="ingredient-name">{name}</span>
            <span className="ingredient-measure">{measure}</span>
          </li>
        ))}
      </ul>

      <h2 className="detail-section-title">Instrucciones</h2>
      <ol className="step-list">
        {getSteps().map((step: string, i: number) => (
          <li key={i} className="step-item">
            <span className="step-number">{i + 1}</span>
            <span className="step-text">{step}</span>
          </li>
        ))}
      </ol>

      {meal.strYoutube && (
        <div className="youtube-link-wrapper">
          <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer" className="youtube-link">
            <img src="/youtube.png" alt="YouTube" className="youtube-icon" />
            Ver receta en YouTube
          </a>
        </div>
      )}
    </div>
  )
}
