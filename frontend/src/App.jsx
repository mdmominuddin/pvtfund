import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './index.css'

// Core Components
import Addfund from './components/Addfund'
import Dashboard from './components/Dashboard'
import Fundstate from './components/Fundstate'
import AddExpense from './components/Addexpense'

// Auth Components
import Login from './components/Login'
import Register from './components/Register'

// Welcome Page
import Welcome from './components/Welcome'

// Protected Route Wrapper
import PrivateRoute from './components/PrivateRoute'

function NavigationBar() {
  const location = useLocation()
  const hideNav = location.pathname === '/'

  if (hideNav) return null

  return (
    <nav className="w-full bg-white shadow-md p-4 flex justify-center gap-6 sticky top-0 z-50">
      <Link to="/addfund" className="text-blue-600 hover:underline">Add Fund</Link>
      <Link to="/addexpenses" className="text-blue-600 hover:underline">Add Expenses</Link>
      <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
      <Link to="/fundstate" className="text-blue-600 hover:underline">Fund State</Link>
      
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen w-screen flex flex-col bg-gray-100">
        <NavigationBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-wrap gap-4 p-6 border border-gray-300 rounded-lg bg-white shadow-lg max-w-4xl w-full justify-center">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/addfund" element={<Addfund />} />
              <Route path="/addexpenses" element={<AddExpense />} />
              <Route path="/fundstate" element={<Fundstate />} />
              
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
