import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVideoStats } from '../../hooks/useVideoStats'

beforeEach(() => {
  localStorage.clear()
})

describe('useVideoStats', () => {
  it('starts with zero views and likes', () => {
    const { result } = renderHook(() => useVideoStats('1'))
    expect(result.current.views).toBe(0)
    expect(result.current.likes).toBe(0)
    expect(result.current.liked).toBe(false)
  })

  it('increments views', () => {
    const { result } = renderHook(() => useVideoStats('1'))
    act(() => result.current.incrementViews())
    expect(result.current.views).toBe(1)
    act(() => result.current.incrementViews())
    expect(result.current.views).toBe(2)
  })

  it('toggles like on and off', () => {
    const { result } = renderHook(() => useVideoStats('1'))
    act(() => result.current.toggleLike())
    expect(result.current.liked).toBe(true)
    expect(result.current.likes).toBe(1)
    act(() => result.current.toggleLike())
    expect(result.current.liked).toBe(false)
    expect(result.current.likes).toBe(0)
  })

  it('tracks stats independently per video id', () => {
    const { result: a } = renderHook(() => useVideoStats('1'))
    const { result: b } = renderHook(() => useVideoStats('2'))
    act(() => a.current.incrementViews())
    expect(a.current.views).toBe(1)
    expect(b.current.views).toBe(0)
  })
})