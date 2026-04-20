import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Watch from './pages/Watch'

export default function App() {
  const [query, setQuery] = useState('')

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
        <Navbar query={query} onQueryChange={setQuery} />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home query={query} />} />
          <Route path="/watch/:id" element={<Watch />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}