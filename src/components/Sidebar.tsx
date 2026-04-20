import { useNavigate } from 'react-router-dom'
import { useWatchHistory } from '../hooks/useWatchHistory'

const navItems = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '🔥', label: 'Trending', path: '/' },
  { icon: '📺', label: 'Subscriptions', path: '/' },
  { icon: '📚', label: 'Library', path: '/' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { history, clearHistory } = useWatchHistory()

  return (
    <aside className="fixed top-12 left-0 w-52 h-full bg-[#0f0f0f] pt-2 hidden md:flex flex-col overflow-y-auto pb-10">
      <nav className="px-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-4 w-full px-4 py-2 text-sm text-[#f1f1f1] hover:bg-[#272727] rounded-lg"
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-[#272727] my-2" />

      {history.length > 0 && (
        <div className="px-1">
          <div className="flex items-center justify-between px-4 mb-1">
            <span className="text-xs font-medium text-[#aaa] uppercase tracking-wider">History</span>
            <button onClick={clearHistory} className="text-xs text-[#aaa] hover:text-red-500">Clear</button>
          </div>
          {history.map((v) => (
            <button
              key={v.id}
              onClick={() => navigate(`/watch/${v.id}`)}
              className="flex items-center gap-2 w-full px-4 py-1.5 text-xs text-[#aaa] hover:text-white truncate"
            >
              <span>🕑</span>
              <span className="truncate">{v.title}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}