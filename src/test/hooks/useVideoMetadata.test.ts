import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVideoMetadata } from '../../hooks/useVideoMetadata'

beforeEach(() => {
  localStorage.clear()
})

describe('useVideoMetadata', () => {
  it('returns empty metadata for unknown id', () => {
    const { result } = renderHook(() => useVideoMetadata())
    expect(result.current.getMetadata('999')).toEqual({})
  })

  it('saves and retrieves title', () => {
    const { result } = renderHook(() => useVideoMetadata())
    act(() => result.current.saveMetadata('1', { title: 'My Custom Title' }))
    expect(result.current.getMetadata('1').title).toBe('My Custom Title')
  })

  it('saves and retrieves description', () => {
    const { result } = renderHook(() => useVideoMetadata())
    act(() => result.current.saveMetadata('1', { description: 'A great video' }))
    expect(result.current.getMetadata('1').description).toBe('A great video')
  })

  it('merges updates without overwriting other fields', () => {
    const { result } = renderHook(() => useVideoMetadata())
    act(() => result.current.saveMetadata('1', { title: 'Title' }))
    act(() => result.current.saveMetadata('1', { description: 'Desc' }))
    const meta = result.current.getMetadata('1')
    expect(meta.title).toBe('Title')
    expect(meta.description).toBe('Desc')
  })
})