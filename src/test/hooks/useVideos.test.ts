import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useVideos } from '../../hooks/useVideos'
import type { Video } from '../../types/video'

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Original Title',
    channel: 'Local',
    channelAvatar: '',
    filePath: '/videos/test.mp4',
    views: '0 views',
    uploadedAt: 'Today',
    duration: '5:00',
  },
  {
    id: '2',
    title: 'Second Video',
    channel: 'Local',
    channelAvatar: '',
    filePath: '/videos/test2.mp4',
    views: '0 views',
    uploadedAt: 'Yesterday',
    duration: '3:00',
  },
]

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useVideos', () => {
  it('fetches and returns videos', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockVideos),
    }))

    const { result } = renderHook(() => useVideos())
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.videos).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it('merges custom metadata title over server title', async () => {
    localStorage.setItem('ollietube_metadata', JSON.stringify({
      '1': { title: 'My Custom Title' }
    }))

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockVideos),
    }))

    const { result } = renderHook(() => useVideos())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.videos[0].title).toBe('My Custom Title')
    expect(result.current.videos[1].title).toBe('Second Video')
  })

  it('merges custom description over server data', async () => {
    localStorage.setItem('ollietube_metadata', JSON.stringify({
      '1': { description: 'A custom description' }
    }))

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockVideos),
    }))

    const { result } = renderHook(() => useVideos())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.videos[0].description).toBe('A custom description')
  })

  it('keeps server title when no custom metadata exists', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockVideos),
    }))

    const { result } = renderHook(() => useVideos())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.videos[0].title).toBe('Original Title')
  })

  it('sets error when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const { result } = renderHook(() => useVideos())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Could not load videos')
    expect(result.current.videos).toHaveLength(0)
  })

  it('refetches when metadata-updated event fires', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockVideos),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useVideos())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    window.dispatchEvent(new Event('metadata-updated'))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })
})