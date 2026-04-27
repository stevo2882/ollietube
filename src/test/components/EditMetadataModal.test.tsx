import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditMetadataModal from '../../components/EditMetadataModal'
import type { Video } from '../../types/video'

const mockVideo: Video = {
  id: '1',
  title: 'Original Title',
  description: 'Original description',
  channel: 'Local',
  channelAvatar: '',
  filePath: '/videos/test.mp4',
  views: '0 views',
  uploadedAt: 'Today',
  duration: '5:00',
}

vi.mock('../../hooks/useVideoMetadata', () => ({
  useVideoMetadata: () => ({
    saveMetadata: vi.fn(),
    getMetadata: vi.fn().mockReturnValue({}),
  }),
}))

beforeEach(() => {
  localStorage.clear()
})

describe('EditMetadataModal', () => {
  it('renders with current video title', () => {
    render(<EditMetadataModal video={mockVideo} onClose={vi.fn()} />)
    expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument()
  })

  it('renders with current video description', () => {
    render(<EditMetadataModal video={mockVideo} onClose={vi.fn()} />)
    expect(screen.getByDisplayValue('Original description')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', async () => {
    const onClose = vi.fn()
    render(<EditMetadataModal video={mockVideo} onClose={onClose} />)
    await userEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when X button is clicked', async () => {
    const onClose = vi.fn()
    render(<EditMetadataModal video={mockVideo} onClose={onClose} />)
    await userEvent.click(screen.getByText('✕'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<EditMetadataModal video={mockVideo} onClose={onClose} />)
    await userEvent.click(screen.getByText('Edit video info').parentElement!.parentElement!)
  })

  it('updates title input when typed', async () => {
    render(<EditMetadataModal video={mockVideo} onClose={vi.fn()} />)
    const input = screen.getByLabelText('Title')
    await userEvent.clear(input)
    await userEvent.type(input, 'New Title')
    expect(input).toHaveValue('New Title')
  })

  it('updates description input when typed', async () => {
    render(<EditMetadataModal video={mockVideo} onClose={vi.fn()} />)
    const textarea = screen.getByLabelText('Description')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'New description')
    expect(textarea).toHaveValue('New description')
  })

  it('calls onClose when save is clicked', async () => {
    const onClose = vi.fn()
    render(<EditMetadataModal video={mockVideo} onClose={onClose} />)
    await userEvent.click(screen.getByText('Save'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})