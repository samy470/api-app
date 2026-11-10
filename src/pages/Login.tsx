import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Login({
  setIsLoggedIn,
  setUsername,
}: {
  setIsLoggedIn: (value: boolean) => void
  setUsername: (value: string) => void
}) {
  const [localUsername, setLocalUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: localUsername, password }),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', localUsername)
        setUsername(localUsername)
        setIsLoggedIn(true)
        navigate('/')
      } else {
        setMessage(data.error)
      }
    } catch {
      setMessage('Cannot reach the server, try again later')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-[#0d1421] px-4">
      <Card className="w-full max-w-sm bg-gray-900 border border-gray-800 text-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-gray-400">
            Login to your CryptoTracker account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                placeholder="username"
                required
                autoComplete="username"
                value={localUsername}
                onChange={e => setLocalUsername(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-green-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white focus-visible:ring-green-500"
              />
            </div>

            {message && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {message}
              </p>
            )}

            <Button
              type="submit"
              isDisabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-gray-400">
          Don't have an account?
          <Link to="/register" className="ml-1 text-green-400 hover:underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}