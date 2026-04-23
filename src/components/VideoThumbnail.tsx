import { useEffect, useState } from 'react'
import { generateThumbnail } from '../utils/generateThumbnail'

interface VideoThumbnailProps {
  filePath: string
  alt: string
}

const CACHE_PREFIX = 'ollietube_thumb_'

export default function VideoThumbnail({ filePath, alt }: VideoThumbnailProps) {
  const cacheKey = CACHE_PREFIX + btoa(filePath)
  const [src, setSrc] = useState<string | null>(() => {
    try {
      return localStorage.getItem(cacheKey)
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (src) return // already cached
    generateThumbnail(filePath)
      .then((dataUrl) => {
        try {
          localStorage.setItem(cacheKey, dataUrl)
        } catch {
          // localStorage full — just use it in memory
        }
        setSrc(dataUrl)
      })
      .catch(() => setSrc(null))
  }, [filePath])

  if (!src) {
    return (
      <div className="w-full h-full bg-[#272727] animate-pulse" />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
    />
  )
}