import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

interface NavbarProps {
  search: string
  setSearch: (value: string) => void
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  username: string
  setUsername: (value: string) => void
}

export default function Navbar({ search, setSearch, isLoggedIn, setIsLoggedIn, username, setUsername }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    setIsLoggedIn(false)
    setUsername('')
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setIsOpen(false)
    navigate('/')
  }

  return (
    <nav className="flex-wrap gap-3 bg-[#0d1421] text-white px-4 md:px-8 py-4 flex items-center justify-between border-b border-gray-800">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-green-400 text-2xl font-bold">🦎</span>
        <span className="text-lg font-semibold">CryptoTracker</span>
      </Link>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search coins..."
          className="bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 w-full md:w-64 order-3 md:order-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition"
            >
              👤 {username}
            </button>
            {isOpen && (
              <div className="absolute right-0 z-50 bg-gray-800 rounded-lg shadow-lg w-40 mt-1 overflow-hidden">
                <Link
                  to="/portfolio"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Portfolio
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg text-sm bg-green-500 hover:bg-green-400 text-black font-semibold transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
