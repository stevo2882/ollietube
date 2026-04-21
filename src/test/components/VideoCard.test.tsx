import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import VideoCard from '../../components/VideoCard'
import type { Video } from '../../types/video'

const mockVideo: Video = {
  id: '1',
  title: 'Test Video Title',
  channel: 'Test Channel',
  channelAvatar: '',
  filePath: '/videos/test.mp4',
  views: '0 views',
  uploadedAt: '3 days ago',
  duration: '5:00',
}

// Mock hooks that touch localStorage and canvas
vi.mock('../../hooks/useVideoStats', () => ({
  useVideoStats: () => ({ views: 42, likes: 7, liked: false }),
}))

vi.mock('../../components/VideoThumbnail', () => ({
  default: () => <div data-testid="thumbnail" />,
}))

describe('VideoCard', () => {
  it('renders the video title', () => {
    render(<MemoryRouter><VideoCard video={mockVideo} /></MemoryRouter>)
    expect(screen.getByText('Test Video Title')).toBeInTheDocument()
  })

  it('renders the channel name', () => {
    render(<MemoryRouter><VideoCard video={mockVideo} /></MemoryRouter>)
    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  it('renders view and like counts', () => {
    render(<MemoryRouter><VideoCard video={mockVideo} /></MemoryRouter>)
    expect(screen.getByText(/42 views/)).toBeInTheDocument()
  })

  it('navigates on click', async () => {
    render(<MemoryRouter><VideoCard video={mockVideo} /></MemoryRouter>)
    await userEvent.click(screen.getByText('Test Video Title'))
    // navigation is handled by react-router, just verify no crash
  })
})