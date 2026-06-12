import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../../src/pages/Home'

vi.mock('../../src/services/mealDbApi', () => ({
  fetchCategories: vi.fn().mockResolvedValue([
    { strCategory: 'Beef', strCategoryThumb: '' },
    { strCategory: 'Chicken', strCategoryThumb: '' },
  ]),
  fetchMealsByCategory: vi.fn().mockResolvedValue([]),
  searchMeals: vi.fn().mockResolvedValue([
    { idMeal: '1', strMeal: 'Spicy Arrabiata Penne', strMealThumb: 'https://example.com/img.jpg', strCategory: 'Pasta' },
    { idMeal: '2', strMeal: 'Chicken Handi', strMealThumb: 'https://example.com/img2.jpg', strCategory: 'Chicken' },
  ]),
}))

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('Home', () => {
  it('muestra el título Cookly', async () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText('Cookly')).toBeInTheDocument()
  })

  it('muestra las categorías', async () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getByText(/Carnes/i)).toBeInTheDocument()
    })
  })

  it('muestra el título Recetas Populares por defecto', async () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText('Recetas Populares')).toBeInTheDocument()
  })

  it('muestra las recetas al cargar', async () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getByText('Spicy Arrabiata Penne')).toBeInTheDocument()
    })
  })
})
