import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchMeals, fetchMealById, fetchCategories, fetchRandomMeal } from '../../src/services/mealDbApi'

const mockMeal = {
  idMeal: '52772',
  strMeal: 'Teriyaki Chicken Casserole',
  strCategory: 'Chicken',
  strArea: 'Japanese',
  strMealThumb: 'https://example.com/img.jpg',
}

const mockCategory = { idCategory: '1', strCategory: 'Beef', strCategoryThumb: '', strCategoryDescription: '' }

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('searchMeals', () => {
  it('retorna lista de recetas al buscar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ meals: [mockMeal] }),
    }))
    const results = await searchMeals('chicken')
    expect(results).toHaveLength(1)
    expect(results[0].strMeal).toBe('Teriyaki Chicken Casserole')
  })

  it('retorna array vacío si no hay resultados', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ meals: null }),
    }))
    const results = await searchMeals('xyzxyz')
    expect(results).toEqual([])
  })
})

describe('fetchMealById', () => {
  it('retorna la receta correcta por id', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ meals: [mockMeal] }),
    }))
    const meal = await fetchMealById('52772')
    expect(meal).not.toBeNull()
    expect(meal.idMeal).toBe('52772')
  })
})

describe('fetchCategories', () => {
  it('retorna lista de categorías', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ categories: [mockCategory] }),
    }))
    const cats = await fetchCategories()
    expect(cats).toHaveLength(1)
    expect(cats[0].strCategory).toBe('Beef')
  })
})

describe('fetchRandomMeal', () => {
  it('retorna una receta aleatoria', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ meals: [mockMeal] }),
    }))
    const meal = await fetchRandomMeal()
    expect(meal).not.toBeNull()
    expect(meal.strMeal).toBeDefined()
  })
})
