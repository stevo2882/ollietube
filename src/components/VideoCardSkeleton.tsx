export default function VideoCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl aspect-video bg-[#272727]" />
      <div className="flex gap-3 mt-3">
        <div className="w-8 h-8 rounded-full bg-[#272727] flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="h-3 bg-[#272727] rounded w-full" />
          <div className="h-3 bg-[#272727] rounded w-3/4" />
          <div className="h-3 bg-[#272727] rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}