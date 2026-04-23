import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const app = express()
app.use(cors())

const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos')

function formatDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 60) return '1 month ago'
  return `${Math.floor(diffDays / 30)} months ago`
}

function fileNameToTitle(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function getVideoDuration(filePath: string): string {
  try {
    const output = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      { encoding: 'utf8' }
    ).trim()
    const seconds = parseFloat(output)
    if (isNaN(seconds)) return ''
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  } catch {
    return ''
  }
}

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/videos', (req, res) => {
  const files = fs.readdirSync(VIDEOS_DIR).filter((f) =>
    ['.mp4', '.mov', '.webm', '.mkv'].includes(path.extname(f).toLowerCase())
  )

  const videos = files.map((file, index) => {
    const fullPath = path.join(VIDEOS_DIR, file)
    const fileStat = fs.statSync(fullPath)
    return {
      id: String(index + 1),
      title: fileNameToTitle(file),
      channel: 'Local',
      channelAvatar: `https://i.pravatar.cc/40?img=${index + 1}`,
      filePath: `/videos/${file}`,
      uploadedAt: formatDate(fileStat.birthtime),
      views: '0 views',
      duration: getVideoDuration(fullPath),
    }
  })

  res.json(videos)
})

app.listen(3001, () => {
  console.log('Video API running at http://localhost:3001')
})