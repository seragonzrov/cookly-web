import { describe, it, expect } from 'vitest'
import { categoryTranslations } from '../../src/constants/categoryTranslations'
import { areaTranslations } from '../../src/constants/areaTranslations'

describe('categoryTranslations', () => {
  it('tiene entradas para las categorías principales', () => {
    expect(categoryTranslations['Beef']).toBeDefined()
    expect(categoryTranslations['Chicken']).toBeDefined()
    expect(categoryTranslations['Dessert']).toBeDefined()
  })

  it('cada entrada tiene label y emoji', () => {
    Object.values(categoryTranslations).forEach(entry => {
      expect(entry.label).toBeTruthy()
      expect(entry.emoji).toBeTruthy()
    })
  })

  it('Beef se traduce como Carnes', () => {
    expect(categoryTranslations['Beef'].label).toBe('Carnes')
  })

  it('Dessert se traduce como Postres', () => {
    expect(categoryTranslations['Dessert'].label).toBe('Postres')
  })
})

describe('areaTranslations', () => {
  it('tiene entradas para las nacionalidades principales', () => {
    expect(areaTranslations['Italian']).toBeDefined()
    expect(areaTranslations['Mexican']).toBeDefined()
    expect(areaTranslations['French']).toBeDefined()
  })

  it('cada valor es un string no vacío', () => {
    Object.values(areaTranslations).forEach(val => {
      expect(typeof val).toBe('string')
      expect(val.length).toBeGreaterThan(0)
    })
  })

  it('Italian se traduce como Italiana', () => {
    expect(areaTranslations['Italian']).toBe('Italiana')
  })
})
