import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Home from '../../pages/Home'
import Watch from '../../pages/Watch'
import type { Video } from '../../types/video'

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'First Video',
    channel: 'Chan A',
    channelAvatar: '',
    filePath: '/videos/first.mp4',
    views: '0 views',
    uploadedAt: 'Today',
    duration: '3:00',
  },
  {
    id: '2',
    title: 'Second Video',
    channel: 'Chan B',
    channelAvatar: '',
    filePath: '/videos/second.mp4',
    views: '0 views',
    uploadedAt: 'Yesterday',
    duration: '5:00',
  },
]

vi.mock('../../hooks/useVideos', () => ({
  useVideos: () => ({ videos: mockVideos, loading: false, error: null }),
}))

vi.mock('../../components/VideoThumbnail', () => ({
  default: () => <div data-testid="thumbnail" />,
}))

vi.mock('../../components/VideoPlayer', () => ({
  default: ({ src }: { src: string }) => <video data-testid="player" src={src} />,
}))

beforeEach(() => {
  localStorage.clear()
})

describe('Watch flow', () => {
  it('renders video cards on the home page', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home query="" />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('First Video')).toBeInTheDocument()
      expect(screen.getByText('Second Video')).toBeInTheDocument()
    })
  })

  it('filters videos by search query', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home query="First" />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('First Video')).toBeInTheDocument()
      expect(screen.queryByText('Second Video')).not.toBeInTheDocument()
    })
  })

  it('shows empty state when no results match', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home query="zzznomatch" />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/No results for/)).toBeInTheDocument()
    })
  })

  it('renders the watch page for a valid video id', async () => {
    render(
      <MemoryRouter initialEntries={['/watch/1']}>
        <Routes>
          <Route path="/watch/:id" element={<Watch />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('First Video')).toBeInTheDocument()
      expect(screen.getByTestId('player')).toHaveAttribute('src', '/videos/first.mp4')
    })
  })

  it('shows not found for an invalid video id', async () => {
    render(
      <MemoryRouter initialEntries={['/watch/999']}>
        <Routes>
          <Route path="/watch/:id" element={<Watch />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/Video not found/)).toBeInTheDocument()
    })
  })
})