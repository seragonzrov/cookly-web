import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Favorites from '../../src/pages/Favorites'

const mockFavorites = [
  { idMeal: '1', strMeal: 'Spicy Arrabiata Penne', strMealThumb: 'https://example.com/img.jpg', strCategory: 'Pasta', savedAt: Date.now() },
  { idMeal: '2', strMeal: 'Chicken Handi', strMealThumb: 'https://example.com/img2.jpg', strCategory: 'Chicken', savedAt: Date.now() - 1000 },
]

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('Favorites', () => {
  it('muestra mensaje cuando no hay favoritos', () => {
    render(<MemoryRouter><Favorites /></MemoryRouter>)
    expect(screen.getByText('No tenés favoritos guardados todavía.')).toBeInTheDocument()
  })

  it('muestra los favoritos guardados', () => {
    localStorage.setItem('favorites', JSON.stringify(mockFavorites))
    render(<MemoryRouter><Favorites /></MemoryRouter>)
    expect(screen.getByText('Spicy Arrabiata Penne')).toBeInTheDocument()
    expect(screen.getByText('Chicken Handi')).toBeInTheDocument()
  })

  it('elimina un favorito al hacer click en el corazón', () => {
    localStorage.setItem('favorites', JSON.stringify(mockFavorites))
    render(<MemoryRouter><Favorites /></MemoryRouter>)
    const favBtns = document.querySelectorAll('.meal-card-fav-btn')
    fireEvent.click(favBtns[0])
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]')
    expect(stored).toHaveLength(1)
  })

  it('muestra el botón de filtros cuando hay favoritos', () => {
    localStorage.setItem('favorites', JSON.stringify(mockFavorites))
    render(<MemoryRouter><Favorites /></MemoryRouter>)
    const filterBtn = document.querySelector('.btn-outline-secondary')
    expect(filterBtn).toBeTruthy()
  })
})
