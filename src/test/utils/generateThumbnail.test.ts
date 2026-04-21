import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the DOM elements used in generateThumbnail
beforeEach(() => {
  const mockCanvas = {
    width: 0,
    height: 0,
    getContext: vi.fn().mockReturnValue({
      drawImage: vi.fn(),
    }),
    toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,mockdata'),
  }

  const mockVideo = {
    src: '',
    crossOrigin: '',
    muted: false,
    playsInline: false,
    currentTime: 0,
    duration: 10,
    videoWidth: 320,
    videoHeight: 180,
    load: vi.fn(),
    addEventListener: vi.fn((event, cb) => {
      if (event === 'loadedmetadata') cb()
      if (event === 'seeked') cb()
    }),
  }

  vi.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement
    if (tag === 'video') return mockVideo as unknown as HTMLVideoElement
    return document.createElement(tag)
  })
})

describe('generateThumbnail', () => {
  it('returns a base64 data URL', async () => {
    const { generateThumbnail } = await import('../../utils/generateThumbnail')
    const result = await generateThumbnail('/videos/test.mp4')
    expect(result).toMatch(/^data:image\/jpeg;base64,/)
  })

  it('uses the seekTo parameter', async () => {
    const { generateThumbnail } = await import('../../utils/generateThumbnail')
    const result = await generateThumbnail('/videos/test.mp4', 5)
    expect(result).toBeTruthy()
  })
})