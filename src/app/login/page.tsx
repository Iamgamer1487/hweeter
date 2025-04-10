
"use client"
import { use, useState } from "react";
import {account} from '../../../lib/appwrite_client'
import { ID } from "appwrite";

const Login = () => {
  const [email, setEmail] = useState(""); // State for email
  const [user, setUser] = useState("")
  const [message, setMessage] = useState(""); // State for success/error message

  // Handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault(); // Prevent page refresh
    try{
        account!.createMagicURLToken(
          ID.unique(),
          email,
          'http://localhost:3000/verify'

        )

        setMessage(`✅ Magic link sent to ${email}`);
    }
    catch (error: any){
        setMessage(`❌ ${error.message}`);
    }

  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Login Page
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter info:
            </label>
            <input
              type="type"
              name="email"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your username"
              required
            />


          <input
              type="email"
              name="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Send Magic Link
          </button>
        </form>

        {/* Show message if exists */}
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.startsWith("✅")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
