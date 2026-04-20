import { useState } from 'react'
import { useVideoMetadata } from '../hooks/useVideoMetadata'
import type { Video } from '../types/video'

interface Props {
  video: Video
  onClose: () => void
}

export default function EditMetadataModal({ video, onClose }: Props) {
  const { saveMetadata } = useVideoMetadata()
  const [title, setTitle] = useState(video.title)
  const [description, setDescription] = useState(video.description ?? '')

  function handleSave() {
    saveMetadata(video.id, { title, description })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-[#212121] rounded-xl w-full max-w-md mx-4 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#f1f1f1]">Edit video info</h2>
          <button onClick={onClose} className="text-[#aaa] hover:text-white text-lg leading-none">✕</button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#aaa]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#121212] border border-[#303030] rounded-lg px-3 py-2 text-sm text-[#f1f1f1] focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#aaa]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Add a description..."
            className="bg-[#121212] border border-[#303030] rounded-lg px-3 py-2 text-sm text-[#f1f1f1] focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-sm text-[#f1f1f1] hover:bg-[#303030]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-white text-black hover:bg-neutral-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}