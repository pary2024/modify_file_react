import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Example hardcoded credentials
    const validEmail = "admin@example.com";
    const validPassword = "123456";

    if (email === validEmail && password === validPassword) {
      setError("");
      alert("Login successful!");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transition-all"
      >
        {/* Dentist Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWbQToNUShJSUfC14XOM3QXCJf4BalOfIRQ&s"
            alt="Dentist Logo"
            className="w-20 h-20 rounded-full border-2 border-blue-500"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Dental Clinic Login
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Please enter your credentials to access the admin panel.
        </p>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>

        <div className="mt-4 text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
