import { describe, it, expect } from 'vitest'
import { formatTime } from '../../utils/formatTime'

describe('formatTime', () => {
  it('formats zero seconds', () => {
    expect(formatTime(0)).toBe('0:00')
  })

  it('formats seconds only', () => {
    expect(formatTime(45)).toBe('0:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(125)).toBe('2:05')
  })

  it('pads single digit seconds', () => {
    expect(formatTime(61)).toBe('1:01')
  })

  it('formats long videos correctly', () => {
    expect(formatTime(3661)).toBe('61:01')
  })
})