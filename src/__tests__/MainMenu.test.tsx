import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MainMenu from '../../app/components/MainMenu'

describe('MainMenu', () => {
  it('debería renderizar el título principal', () => {
    render(<MainMenu />)
    expect(screen.getByText('Encuentra tu próxima aventura')).toBeInTheDocument()
  })

  it('debería renderizar el formulario de búsqueda', () => {
    render(<MainMenu />)

    const input = screen.getByPlaceholderText('Buscar por título, autor o ISBN...') as HTMLInputElement
    expect(input).toBeInTheDocument()

    // El botón contiene el texto "Buscar"
    expect(screen.getByText('Buscar')).toBeInTheDocument()
  })

  it('debería renderizar iconos SVG en la UI', () => {
    render(<MainMenu />)
    const icons = document.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })
})
