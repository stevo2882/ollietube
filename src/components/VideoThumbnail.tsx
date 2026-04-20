import { useEffect, useState } from 'react'
import { generateThumbnail } from '../utils/generateThumbnail'

interface VideoThumbnailProps {
  filePath: string
  alt: string
}

export default function VideoThumbnail({ filePath, alt }: VideoThumbnailProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    generateThumbnail(filePath)
      .then(setSrc)
      .catch(() => setSrc(null))
  }, [filePath])

  if (!src) {
    return (
      <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
        <span className="text-neutral-400 text-xs">Loading...</span>
      </div>
    )
  }

  return <img src={src} alt={alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
}