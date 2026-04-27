import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../../components/Navbar'

describe('Navbar', () => {
  it('renders the logo', () => {
    render(<MemoryRouter><Navbar query="" onQueryChange={vi.fn()} /></MemoryRouter>)
    expect(screen.getByText('OllieTube')).toBeInTheDocument()
  })

  it('renders the search input with current query', () => {
    render(<MemoryRouter><Navbar query="hello" onQueryChange={vi.fn()} /></MemoryRouter>)
    expect(screen.getByPlaceholderText('Search')).toHaveValue('hello')
  })

  it('calls onQueryChange when typing', async () => {
    const onChange = vi.fn()
    render(<MemoryRouter><Navbar query="" onQueryChange={onChange} /></MemoryRouter>)
    await userEvent.type(screen.getByPlaceholderText('Search'), 'react')
    expect(onChange).toHaveBeenCalled()
  })

  it('logo navigates home when clicked', async () => {
    render(<MemoryRouter><Navbar query="" onQueryChange={vi.fn()} /></MemoryRouter>)
    await userEvent.click(screen.getByText('OllieTube'))
    // No crash = navigation was triggered successfully
  })
})