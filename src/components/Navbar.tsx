interface NavbarProps {
  query: string
  onQueryChange: (value: string) => void
}

export default function Navbar({ query, onQueryChange }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-12 bg-[#0f0f0f] border-b border-[#272727]">
      <div className="flex items-center gap-2 text-sm font-bold text-white whitespace-nowrap">
        <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center text-[10px]">▶</div>
        OllieTube
      </div>
      <div className="flex flex-1 max-w-md mx-6">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search"
          className="flex-1 bg-[#121212] border border-[#303030] border-r-0 rounded-l-full px-4 h-8 text-sm text-white placeholder-[#717171] focus:outline-none focus:border-blue-500"
        />
        <button className="bg-[#272727] border border-[#303030] rounded-r-full px-4 h-8 text-white text-sm hover:bg-[#3f3f3f]">
          ⌕
        </button>
      </div>
      <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">
        S
      </div>
    </header>
  )
}