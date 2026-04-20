import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ollietube_metadata'

interface VideoMetadata {
  title?: string
  description?: string
}

type MetadataStore = Record<string, VideoMetadata>

function getStored(): MetadataStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function save(store: MetadataStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  window.dispatchEvent(new Event('metadata-updated'))
}

export function useVideoMetadata() {
  const [store, setStore] = useState<MetadataStore>(getStored)

  useEffect(() => {
    function onUpdate() {
      setStore(getStored())
    }
    window.addEventListener('metadata-updated', onUpdate)
    return () => window.removeEventListener('metadata-updated', onUpdate)
  }, [])

  function getMetadata(id: string): VideoMetadata {
    return store[id] ?? {}
  }

  function saveMetadata(id: string, data: VideoMetadata) {
    const updated = { ...store, [id]: { ...store[id], ...data } }
    save(updated)
    setStore(updated)
  }

  return { getMetadata, saveMetadata }
}