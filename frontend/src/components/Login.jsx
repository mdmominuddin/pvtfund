import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/login/', {
        username,
        password
      })
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      navigate('/dashboard')
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto p-4 border rounded">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700"
      >
        Login
      </button>
      <p className="text-center">
        Not registered? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
      </p>
    </form>
  )
}

export default Login
