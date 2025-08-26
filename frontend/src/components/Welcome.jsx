import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Login from "./Login"
import Register from "./Register"


const formVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const welcomeInfoVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function Welcome() {
  const [showForm, setShowForm] = useState(null) // null | 'login' | 'register'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Section - Branding */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Private Fund Management System
          </h1>
          <p className="text-lg md:text-xl mb-6 leading-relaxed">
            A secure and intelligent platform to manage, track, and report your
            private funds and expenses. Designed with role-based access, detailed
            dashboards, and simplified financial oversight.
          </p>
          {!showForm && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm("login")}
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowForm("register")}
                className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Right Section - Forms / Info */}
        <div className="flex-1 p-10 flex items-center justify-center bg-gray-50">
          <AnimatePresence mode="wait">
            
            {/* Welcome info */}
            {!showForm && (
              <motion.div
                key="welcome-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-md"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Transparency. Control. Growth.
                </h2>
                <ul className="text-gray-600 space-y-3 text-left">
                  <li>✅ Role-based secure access</li>
                  <li>✅ Automated fund summaries</li>
                  <li>✅ Track income & expenses</li>
                  <li>✅ Interactive dashboards</li>
                  <li>✅ Accuracy and Responsibilities</li>
                </ul>
              </motion.div>
            )}

            {/* Login */}
            {showForm === "login" && (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm"
              >
                <Login
                  onBack={() => setShowForm(null)}
                  onSwitchToRegister={() => setShowForm("register")}
                />
              </motion.div>
            )}

            {/* Register */}
            {showForm === "register" && (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm"
              >
                <Register
                  onBack={() => setShowForm(null)}
                  onSwitchToLogin={() => setShowForm("login")}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Welcome
