// components/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8000/api/users/login/', {
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
    <form onSubmit={handleLogin} className="space-y-4">
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="border p-2 w-full" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Login</button>
    </form>
  )
}

export default Login
