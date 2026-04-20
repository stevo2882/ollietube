export function generateThumbnail(filePath: string, seekTo = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = filePath
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(seekTo, video.duration)
    })

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Could not get canvas context'))
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg'))
    })

    video.addEventListener('error', reject)
    video.load()
  })
}