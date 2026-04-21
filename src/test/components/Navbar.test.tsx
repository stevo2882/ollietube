import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../../components/Navbar'

describe('Navbar', () => {
  it('renders the logo', () => {
    render(<Navbar query="" onQueryChange={vi.fn()} />)
    expect(screen.getByText('OllieTube')).toBeInTheDocument()
  })

  it('renders the search input with current query', () => {
    render(<Navbar query="hello" onQueryChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search')).toHaveValue('hello')
  })

  it('calls onQueryChange when typing', async () => {
    const onChange = vi.fn()
    render(<Navbar query="" onQueryChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Search'), 'react')
    expect(onChange).toHaveBeenCalled()
  })
})