import { useNavigate } from 'react-router-dom'
import type { Video } from '../types/video'
import VideoThumbnail from './VideoThumbnail'
import { useVideoStats } from '../hooks/useVideoStats'

export default function VideoCard({ video }: { video: Video }) {
  const navigate = useNavigate()
  const { views, likes } = useVideoStats(video.id)

  return (
    <div className="cursor-pointer group" onClick={() => navigate(`/watch/${video.id}`)}>
      <div className="relative rounded-xl overflow-hidden aspect-video bg-[#272727]">
        <VideoThumbnail filePath={video.filePath} alt={video.title} />
        <span className="absolute bottom-1.5 right-1.5 bg-black/90 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="w-8 h-8 rounded-full bg-[#272727] flex items-center justify-center text-xs text-[#aaa] flex-shrink-0">
          {video.channel[0]}
        </div>
        <div>
          <p className="text-sm font-medium leading-snug line-clamp-2 text-[#f1f1f1]">{video.title}</p>
          <p className="text-xs text-[#aaa] mt-1">{video.channel}</p>
          <p className="text-xs text-[#aaa]">
            {views > 0 ? `${views} views` : 'No views yet'}
            {likes > 0 ? ` · ${likes} 👍` : ''}
            {' · '}{video.uploadedAt}
          </p>
        </div>
      </div>
    </div>
  )
}