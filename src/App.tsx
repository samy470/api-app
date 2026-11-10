import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoinTable from './components/CoinTable'
import Navbar from './components/NavBar'
import Login from './pages/Login'
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';

function App() {
  const [search, setSearch] = useState('')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

  return (
    <BrowserRouter>
      <Navbar search={search} setSearch={setSearch} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} username={username} setUsername={setUsername} />
      <div className="bg-yellow-500/10 border-b border-yellow-500/30 text-yellow-400 text-xs text-center py-2">
        Demo project: all money is fake and no real trades happen. Don't use a real password.
      </div>
      <Routes>
        <Route path='/' element={<CoinTable search={search} />}></Route>
        <Route path='/portfolio' element={<Portfolio />}></Route>
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}></Route>
        <Route path='/register' element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
