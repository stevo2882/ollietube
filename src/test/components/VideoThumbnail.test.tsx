import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import VideoThumbnail from '../../components/VideoThumbnail'

vi.mock('../../utils/generateThumbnail', () => ({
  generateThumbnail: vi.fn().mockResolvedValue('data:image/jpeg;base64,mockdata'),
}))

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe('VideoThumbnail', () => {
  it('shows pulse skeleton while loading', () => {
    const { container } = render(
      <VideoThumbnail filePath="/videos/test.mp4" alt="Test Video" />
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders image after thumbnail generates', async () => {
    render(<VideoThumbnail filePath="/videos/test.mp4" alt="Test Video" />)
    await waitFor(() => {
      expect(screen.getByAltText('Test Video')).toBeInTheDocument()
    })
  })

  it('uses cached thumbnail from localStorage on second render', async () => {
    const cacheKey = 'ollietube_thumb_' + btoa('/videos/cached.mp4')
    localStorage.setItem(cacheKey, 'data:image/jpeg;base64,cached')

    render(<VideoThumbnail filePath="/videos/cached.mp4" alt="Cached Video" />)
    // Should show immediately without waiting
    expect(screen.getByAltText('Cached Video')).toBeInTheDocument()
  })

  it('does not call generateThumbnail when cache exists', async () => {
    const { generateThumbnail } = await import('../../utils/generateThumbnail')
    const cacheKey = 'ollietube_thumb_' + btoa('/videos/cached.mp4')
    localStorage.setItem(cacheKey, 'data:image/jpeg;base64,cached')

    render(<VideoThumbnail filePath="/videos/cached.mp4" alt="Cached Video" />)
    expect(generateThumbnail).not.toHaveBeenCalled()
  })
})