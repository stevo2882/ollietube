import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useVideos } from '../hooks/useVideos'
import { useWatchHistory } from '../hooks/useWatchHistory'
import { useVideoStats } from '../hooks/useVideoStats'
import RelatedVideoCard from '../components/RelatedVideoCard'
import VideoPlayer from '../components/VideoPlayer'
import EditMetadataModal from '../components/EditMetadataModal'

export default function Watch() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { videos, loading } = useVideos()
  const { addToHistory } = useWatchHistory()
  const { views, likes, liked, incrementViews, toggleLike } = useVideoStats(id ?? '')
  const [editing, setEditing] = useState(false)

  const video = videos.find((v) => v.id === id)
  const related = videos.filter((v) => v.id !== id)

  useEffect(() => {
    if (video) {
      addToHistory(video)
      incrementViews()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id])

 if (loading) return (
  <main className="ml-0 md:ml-52 pt-12 px-6 py-6">
    <div className="flex gap-6 flex-col lg:flex-row animate-pulse">
      <div className="flex-1 min-w-0">
        <div className="w-full aspect-video rounded-xl bg-[#272727]" />
        <div className="mt-4 flex flex-col gap-3">
          <div className="h-4 bg-[#272727] rounded w-3/4" />
          <div className="h-3 bg-[#272727] rounded w-1/4" />
        </div>
      </div>
      <div className="w-full lg:w-72 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-40 aspect-video rounded-lg bg-[#272727] flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2 pt-1">
              <div className="h-3 bg-[#272727] rounded w-full" />
              <div className="h-3 bg-[#272727] rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </main>
)

  if (!video) return (
    <main className="ml-0 md:ml-52 pt-12 px-6 py-6 text-center text-[#aaa]">
      Video not found.{' '}
      <button onClick={() => navigate('/')} className="text-blue-400 underline">Go home</button>
    </main>
  )

  return (
    <main className="ml-0 md:ml-52 pt-12 px-6 py-6">
      {editing && <EditMetadataModal video={video} onClose={() => setEditing(false)} />}

      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="flex-1 min-w-0">
          <VideoPlayer key={video.filePath} src={video.filePath} />

          <div className="mt-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-base font-semibold text-[#f1f1f1]">{video.title}</h1>
              <button
                onClick={() => setEditing(true)}
                className="flex-shrink-0 text-xs text-[#aaa] hover:text-white px-3 py-1.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f]"
              >
                ✎ Edit
              </button>
            </div>

            {video.description && (
              <p className="mt-2 text-sm text-[#aaa] leading-relaxed whitespace-pre-wrap">
                {video.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-3 border-t border-[#272727] pt-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#272727] flex items-center justify-center text-xs text-[#aaa]">
                  {video.channel[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f1f1f1]">{video.channel}</p>
                  <p className="text-xs text-[#aaa]">{views} views · {video.uploadedAt}</p>
                </div>
              </div>
              <button
                onClick={toggleLike}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  liked
                    ? 'bg-white text-black'
                    : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f]'
                }`}
              >
                👍 {likes}
              </button>
            </div>
          </div>

          <button onClick={() => navigate('/')} className="mt-5 text-sm text-[#aaa] hover:text-white">
            ← Back to home
          </button>
        </div>

        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-3">
          <h2 className="text-xs font-medium text-[#aaa] uppercase tracking-wider">Up next</h2>
          {related.length === 0 ? (
            <p className="text-xs text-[#717171]">No other videos</p>
          ) : (
            related.map((v) => <RelatedVideoCard key={v.id} video={v} />)
          )}
        </div>
      </div>
    </main>
  )
}