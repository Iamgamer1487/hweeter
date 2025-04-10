// app/verify/Example.tsx

"use client"; // This ensures that the file is executed on the client side only
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { account } from "../../../lib/appwrite_client"; // Assuming this is your appwrite client import

const Example = () => {
  const [isClient, setIsClient] = useState<boolean>(false); // Flag to check if it's the client-side
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId"); // `userId` param from the URL
  const secret = searchParams.get("secret"); // `secret` param from the URL

  const [message, setMessage] = useState<string>(""); // Message state for status updates

  // Ensure we're only running this on the client-side
  useEffect(() => {
    setIsClient(true); // Set isClient to true once component mounts
  }, []);

  useEffect(() => {
    if (isClient && userId && secret) {
      init(); // Call init if both userId and secret are present
    }
  }, [isClient, userId, secret]);

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
