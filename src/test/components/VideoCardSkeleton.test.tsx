import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import VideoCardSkeleton from '../../components/VideoCardSkeleton'

describe('VideoCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<VideoCardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('has animate-pulse class', () => {
    const { container } = render(<VideoCardSkeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })
})