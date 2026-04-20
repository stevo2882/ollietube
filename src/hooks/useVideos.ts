import { useEffect, useState } from 'react'
import type { Video } from '../types/video'

const STORAGE_KEY = 'ollietube_metadata'

function getMetadataStore(): Record<string, { title?: string; description?: string }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function fetchAndMerge() {
      const meta = getMetadataStore()
      fetch('http://localhost:3001/api/videos')
        .then((res) => res.json())
        .then((data: Video[]) => {
          const merged = data.map((v) => ({
            ...v,
            title: meta[v.id]?.title ?? v.title,
            description: meta[v.id]?.description ?? v.description,
          }))
          setVideos(merged)
          setLoading(false)
        })
        .catch(() => {
          setError('Could not load videos')
          setLoading(false)
        })
    }

    fetchAndMerge()

    window.addEventListener('metadata-updated', fetchAndMerge)
    return () => window.removeEventListener('metadata-updated', fetchAndMerge)
  }, [])

  return { videos, loading, error }
}