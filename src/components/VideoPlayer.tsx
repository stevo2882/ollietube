import { useEffect, useRef, useState } from 'react'
import { formatTime } from '../utils/formatTime'

interface VideoPlayerProps {
  src: string
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLInputElement>(null)
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  // Play / pause
  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  // Seek
  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Number(e.target.value)
    setCurrentTime(Number(e.target.value))
  }

  // Volume
  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current
    if (!v) return
    const val = Number(e.target.value)
    v.volume = val
    setVolume(val)
    setMuted(val === 0)
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    v.muted = !muted
    setMuted(!muted)
  }

  // Fullscreen
  function toggleFullscreen() {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  // Auto-hide controls
  function resetHideTimer() {
    setShowControls(true)
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    hideControlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false)
    }, 3000)
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const onTimeUpdate = () => setCurrentTime(v.currentTime)
    const onLoaded = () => setDuration(v.duration)
    const onEnded = () => setPlaying(false)
    const onFullscreenChange = () => setFullscreen(!!document.fullscreenElement)

    v.addEventListener('timeupdate', onTimeUpdate)
    v.addEventListener('loadedmetadata', onLoaded)
    v.addEventListener('ended', onEnded)
    document.addEventListener('fullscreenchange', onFullscreenChange)

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate)
      v.removeEventListener('loadedmetadata', onLoaded)
      v.removeEventListener('ended', onEnded)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') { e.preventDefault(); togglePlay() }
      if (e.code === 'ArrowRight') { if (videoRef.current) videoRef.current.currentTime += 5 }
      if (e.code === 'ArrowLeft') { if (videoRef.current) videoRef.current.currentTime -= 5 }
      if (e.code === 'KeyM') toggleMute()
      if (e.code === 'KeyF') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, muted])

  const volumeIcon = muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden bg-black group"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        className="w-full"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Big play/pause indicator */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${playing ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-black/50 rounded-full w-16 h-16 flex items-center justify-center text-3xl">
          ▶
        </div>
      </div>

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <input
          ref={progressRef}
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 accent-red-500 cursor-pointer mb-2"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/pause */}
            <button
              onClick={togglePlay}
              className="text-white text-lg w-8 h-8 flex items-center justify-center hover:text-red-400 transition-colors"
            >
              {playing ? '⏸' : '▶'}
            </button>

            {/* Volume */}
            <button onClick={toggleMute} className="text-white text-sm">
              {volumeIcon}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="w-20 h-1 accent-white cursor-pointer"
            />

            {/* Time */}
            <span className="text-white text-xs tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="text-white text-sm hover:text-red-400 transition-colors"
          >
            {fullscreen ? '⛶' : '⛶'}
          </button>
        </div>
      </div>
    </div>
  )
}