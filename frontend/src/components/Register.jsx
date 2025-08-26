import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Register({ onBack, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "viewer",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 🔍 Real-time field validation
  const validateField = async (name, value) => {
    let fieldErrors = {};

    if (name === "username" && value.length < 3) {
      fieldErrors.username = "Username must be at least 3 characters.";
    }

    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      fieldErrors.email = "Invalid email format.";
    }

    if (name === "password") {
      if (value.length < 8) {
        fieldErrors.password = "Password must be at least 8 characters.";
      }
    }

    if (name === "password2" && value !== formData.password) {
      fieldErrors.password2 = "Passwords do not match.";
    }

    // 🔄 Server-side check for username/email uniqueness
    if ((name === "username" || name === "email") && value.length >= 3) {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/validate/", {
          [name]: value,
        });
        if (res.data[name]) {
          fieldErrors[name] = res.data[name];
        }
      } catch (err) {
        // Optional: handle server validation errors
      }
    }

    setErrors((prev) => ({ ...prev, ...fieldErrors }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    try {
      const res = await axios.post("/api/register/", formData);
      setMessage(res.data.message);
      setFormData({ username: "", email: "", role: "viewer", password: "", password2: "" });
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Registration failed. Please try again later." });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm"
    >
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {errors.general && <p className="text-red-600 text-center mb-4">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              required
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              required
            />
            {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline"
          >
            Login here
          </button>
        </p>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-2 text-gray-500 hover:underline text-sm"
          >
            ← Back
          </button>
        )}
      </div>
    </motion.div>
  );
}
