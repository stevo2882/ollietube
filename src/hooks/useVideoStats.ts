import { useState, useEffect } from 'react'

const LIKES_KEY = 'ollietube_likes'
const VIEWS_KEY = 'ollietube_views'

function getStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event('video-stats-updated'))
}

export function useVideoStats(videoId: string) {
  const [likes, setLikes] = useState<Record<string, number>>(() =>
    getStored(LIKES_KEY, {})
  )
  const [views, setViews] = useState<Record<string, number>>(() =>
    getStored(VIEWS_KEY, {})
  )
  const [liked, setLiked] = useState<Record<string, boolean>>(() =>
    getStored('ollietube_liked', {})
  )

  useEffect(() => {
    function onUpdate() {
      setLikes(getStored(LIKES_KEY, {}))
      setViews(getStored(VIEWS_KEY, {}))
      setLiked(getStored('ollietube_liked', {}))
    }
    window.addEventListener('video-stats-updated', onUpdate)
    return () => window.removeEventListener('video-stats-updated', onUpdate)
  }, [])

  function incrementViews() {
    const updated = { ...getStored<Record<string, number>>(VIEWS_KEY, {}), [videoId]: (views[videoId] ?? 0) + 1 }
    save(VIEWS_KEY, updated)
    setViews(updated)
  }

  function toggleLike() {
    const isLiked = liked[videoId] ?? false
    const currentLikes = likes[videoId] ?? 0

    const updatedLiked = { ...liked, [videoId]: !isLiked }
    const updatedLikes = { ...likes, [videoId]: isLiked ? currentLikes - 1 : currentLikes + 1 }

    save('ollietube_liked', updatedLiked)
    save(LIKES_KEY, updatedLikes)
    setLiked(updatedLiked)
    setLikes(updatedLikes)
  }

  return {
    views: views[videoId] ?? 0,
    likes: likes[videoId] ?? 0,
    liked: liked[videoId] ?? false,
    incrementViews,
    toggleLike,
  }
}