import { useState, useEffect } from 'react'
import type { Video } from '../types/video'

const STORAGE_KEY = 'ollietube_watch_history'

function getStored(): Video[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function save(videos: Video[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
  window.dispatchEvent(new Event('watch-history-updated'))
}

export function useWatchHistory() {
  const [history, setHistory] = useState<Video[]>(getStored)

  useEffect(() => {
    function onUpdate() {
      setHistory(getStored())
    }
    window.addEventListener('watch-history-updated', onUpdate)
    return () => window.removeEventListener('watch-history-updated', onUpdate)
  }, [])

  function addToHistory(video: Video) {
    const filtered = history.filter((v) => v.id !== video.id)
    const updated = [video, ...filtered].slice(0, 20)
    save(updated)
    setHistory(updated)
  }

  function clearHistory() {
    save([])
    setHistory([])
  }

  return { history, addToHistory, clearHistory }
}