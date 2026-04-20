import { useNavigate } from 'react-router-dom'
import type { Video } from '../types/video'
import VideoThumbnail from './VideoThumbnail'

export default function RelatedVideoCard({ video }: { video: Video }) {
  const navigate = useNavigate()

  return (
    <div className="flex gap-2 cursor-pointer group" onClick={() => navigate(`/watch/${video.id}`)}>
      <div className="relative rounded-lg overflow-hidden aspect-video w-40 flex-shrink-0 bg-[#272727]">
        <VideoThumbnail filePath={video.filePath} alt={video.title} />
      </div>
      <div className="flex flex-col justify-start pt-0.5 min-w-0">
        <p className="text-xs font-medium leading-snug line-clamp-2 text-[#f1f1f1]">{video.title}</p>
        <p className="text-xs text-[#aaa] mt-1">{video.channel}</p>
        <p className="text-xs text-[#aaa]">{video.uploadedAt}</p>
      </div>
    </div>
  )
}