import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Search from '../../src/pages/Search'

vi.mock('../../src/services/mealDbApi', () => ({
  searchMeals: vi.fn().mockResolvedValue([
    { idMeal: '1', strMeal: 'Spicy Arrabiata Penne', strMealThumb: 'https://example.com/img.jpg', strCategory: 'Pasta' },
    { idMeal: '2', strMeal: 'Chicken Handi', strMealThumb: 'https://example.com/img2.jpg', strCategory: 'Chicken' },
  ]),
  fetchRandomMeal: vi.fn().mockResolvedValue({ idMeal: '99' }),
}))

beforeEach(() => {
  localStorage.clear()
})

describe('Search', () => {
  it('muestra el título y el campo de búsqueda', () => {
    render(<MemoryRouter><Search /></MemoryRouter>)
    expect(screen.getByText('Buscar recetas')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Buscar receta...')).toBeInTheDocument()
  })

  it('no muestra "No hay resultados" al cargar', () => {
    render(<MemoryRouter><Search /></MemoryRouter>)
    expect(screen.queryByText('No hay resultados.')).not.toBeInTheDocument()
  })

  it('muestra resultados al buscar', async () => {
    render(<MemoryRouter><Search /></MemoryRouter>)
    fireEvent.change(screen.getByPlaceholderText('Buscar receta...'), { target: { value: 'chicken' } })
    fireEvent.click(screen.getByText('Buscar'))
    await waitFor(() => {
      expect(screen.getByText('Chicken Handi')).toBeInTheDocument()
    })
  })

  it('muestra el botón Sorprendeme', () => {
    render(<MemoryRouter><Search /></MemoryRouter>)
    expect(screen.getByText('Sorprendeme')).toBeInTheDocument()
  })
})
