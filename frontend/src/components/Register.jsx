// components/Register.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (form.password !== form.password2) {
      alert('Passwords do not match')
      return
    }

    try {
      setSubmitting(true)
      const res = await axios.post('/api/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
        password2: form.password2,
        role: form.role,
      })

      // If your API returns tokens on register, store them (optional):
      if (res.data?.access && res.data?.refresh) {
        localStorage.setItem('access', res.data.access)
        localStorage.setItem('refresh', res.data.refresh)
      }

      navigate('/login')
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (typeof err.response?.data === 'string' ? err.response.data : 'Register not successful')
      alert(msg.toString().toUpperCase())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4 max-w-sm mx-auto p-4 border rounded">
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="password2"
        type="password"
        placeholder="Confirm Password"
        value={form.password2}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="role"
        type="text"
        placeholder="Role"
        value={form.role}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
      <p className="text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </form>
  )
}

export default Register
