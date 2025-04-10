// Example.js (or .tsx)

"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { account } from "../../../lib/appwrite_client";

const Example = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [message, setMessage] = useState(""); // State to show status

  useEffect(() => {
    if (userId && secret) {
      init(); // Call init when both params exist
    }
  }, [userId, secret]);

  const init = async () => {
    try {
      // Check if there's already an active session
      const currentSession = await account.get();
      console.log("Current session exists:", currentSession);

      // If session exists, show a message and skip session creation
      setMessage("❗️ You are already logged in.");

    } catch (e) {
      // If no session exists, proceed with magic link session creation
      try {
        //@ts-expect-error
        await account.updateMagicURLSession(userId, secret);
        setMessage("✅ Verification successful! Redirecting...");
        // Redirect to /dashboard after success
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Error during magic link session creation:", error);
        setMessage("❗️ Verification failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Verification</h1>
        {message ? (
          <p
            className={`text-sm ${
              message.startsWith("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        ) : (
          <p className="text-sm text-gray-500">Verifying, please wait...</p>
        )}
      </div>
    </div>
  );
};

export default Example;
