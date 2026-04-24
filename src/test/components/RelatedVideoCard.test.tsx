import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RelatedVideoCard from '../../components/RelatedVideoCard'
import type { Video } from '../../types/video'

const mockVideo: Video = {
  id: '2',
  title: 'Related Video Title',
  channel: 'Some Channel',
  channelAvatar: '',
  filePath: '/videos/related.mp4',
  views: '0 views',
  uploadedAt: '2 days ago',
  duration: '8:30',
}

vi.mock('../../components/VideoThumbnail', () => ({
  default: () => <div data-testid="thumbnail" />,
}))

describe('RelatedVideoCard', () => {
  it('renders the video title', () => {
    render(<MemoryRouter><RelatedVideoCard video={mockVideo} /></MemoryRouter>)
    expect(screen.getByText('Related Video Title')).toBeInTheDocument()
  })

  it('renders the channel name', () => {
    render(<MemoryRouter><RelatedVideoCard video={mockVideo} /></MemoryRouter>)
    expect(screen.getByText('Some Channel')).toBeInTheDocument()
  })

  it('renders the uploaded date', () => {
    render(<MemoryRouter><RelatedVideoCard video={mockVideo} /></MemoryRouter>)
    expect(screen.getByText('2 days ago')).toBeInTheDocument()
  })

  it('renders the thumbnail', () => {
    render(<MemoryRouter><RelatedVideoCard video={mockVideo} /></MemoryRouter>)
    expect(screen.getByTestId('thumbnail')).toBeInTheDocument()
  })

  it('navigates to watch page on click', async () => {
    const { container } = render(
      <MemoryRouter><RelatedVideoCard video={mockVideo} /></MemoryRouter>
    )
    await userEvent.click(container.firstChild as HTMLElement)
  })
})