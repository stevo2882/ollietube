import VideoCard from '../components/VideoCard'
import { useVideos } from '../hooks/useVideos'

interface HomeProps {
  query: string
}

export default function Home({ query }: HomeProps) {
  const { videos, loading, error } = useVideos()

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(query.toLowerCase()) ||
    v.channel.toLowerCase().includes(query.toLowerCase())
  )

  if (loading) return (
    <main className="ml-52 pt-12 px-6 py-6">
      <p className="text-[#aaa] text-sm mt-10 text-center">Loading videos...</p>
    </main>
  )

  if (error) return (
    <main className="ml-52 pt-12 px-6 py-6">
      <p className="text-red-500 text-sm mt-10 text-center">{error}</p>
    </main>
  )

  return (
    <main className="ml-0 md:ml-52 pt-12 px-6 py-6">
      {filtered.length === 0 ? (
        <p className="text-[#aaa] text-sm mt-10 text-center">No results for "{query}"</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </main>
  )
}