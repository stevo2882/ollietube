import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWatchHistory } from '../../hooks/useWatchHistory'
import type { Video } from '../../types/video'

const mockVideo: Video = {
  id: '1',
  title: 'Test Video',
  channel: 'Test Channel',
  channelAvatar: '',
  filePath: '/videos/test.mp4',
  views: '0 views',
  uploadedAt: 'Today',
  duration: '5:00',
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useWatchHistory', () => {
  it('starts with empty history', () => {
    const { result } = renderHook(() => useWatchHistory())
    expect(result.current.history).toEqual([])
  })

  it('adds a video to history', () => {
    const { result } = renderHook(() => useWatchHistory())
    act(() => result.current.addToHistory(mockVideo))
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].id).toBe('1')
  })

  it('does not duplicate videos — moves to top instead', () => {
    const { result } = renderHook(() => useWatchHistory())
    act(() => result.current.addToHistory(mockVideo))
    act(() => result.current.addToHistory(mockVideo))
    expect(result.current.history).toHaveLength(1)
  })

  it('clears history', () => {
    const { result } = renderHook(() => useWatchHistory())
    act(() => result.current.addToHistory(mockVideo))
    act(() => result.current.clearHistory())
    expect(result.current.history).toEqual([])
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useWatchHistory())
    act(() => result.current.addToHistory(mockVideo))
    const stored = JSON.parse(localStorage.getItem('ollietube_watch_history') ?? '[]')
    expect(stored).toHaveLength(1)
  })

  it('caps history at 20 items', async () => {
    const { result } = renderHook(() => useWatchHistory())
    for (let i = 0; i < 25; i++) {
      await act(async () => {
        result.current.addToHistory({ ...mockVideo, id: String(i) })
      })
    }
    expect(result.current.history).toHaveLength(20)
  })
})