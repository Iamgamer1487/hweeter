"use client";

import { useState, useEffect } from "react";
import { account } from "../../../lib/appwrite_client"; // Import your Appwrite client
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tweets, setTweets] = useState<any[]>([]); // State to store fetched tweets

  // Fetch the current user's details and tweets when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get(); // Get authenticated user data
        setUsername(userData.name); // Set the user's name
      } catch (error) {
        setError("Unable to fetch user data.");
      } finally {
        setLoading(false);
      }
    };



    const seeTweets = async () => {
      try {
        const response = await fetch("/api/tweets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setTweets(result.reverse())
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchUser();
    seeTweets();
  }, []);

  // Function to handle tweet submission
  async function Tweet(e: any) {
    e.preventDefault();
    if (!message) return; // Prevent submitting if message is empty

    const tweet = {
      message,
      username,
    };

    try {
      const response = await fetch("/api/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tweet),
      });
      const result = await response.json();
      setTweets([result, ...tweets]); // Add the new tweet to the state
      setMessage(""); // Clear the input after submitting
    } catch (error: any) {
      console.error("Error sending tweet:", error);
      setError("Failed to send tweet.");
    }
  }
  const router = useRouter();
  function LogOut() {
    account.deleteSessions()
      .then(() => {
        console.log("User logged out from all sessions");
        router.push('/login'); // Correct usage of router
      })
      .catch(error => {
        console.error("Logout failed", error);
      });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center w-full text-white bg-black min-h-screen">
      <h1 className="text-6xl my-6 font-extrabold">Dashboard</h1>
      {username && <p>Logged in as: {username}</p>}
      <button className="p-2 ml-2 bg-blue-500 hover:cursor-pointer hover:bg-blue-300" onClick={LogOut}>
        Log Out
      </button>
      {/* Display the tweets */}
      <div className="w-full max-w-xl p-4">
        {tweets.length > 0 ? (
          tweets.map((tweet, index) => (
            <div key={index} className="bg-zinc-800 p-4 mb-4 rounded-xl shadow-md">
              <p className="text-xl font-semibold">{tweet.username}</p>
              <p className="text-lg mt-2">{tweet.message}</p>
            </div>
          ))
        ) : (
          <p>No tweets to show.</p>
        )}
      </div>

      {/* Tweet input form */}
      <div className="flex flex-col items-center">
        <form
          onSubmit={Tweet}
          className="flex flex-row p-4 fixed bottom-0 w-full items-center justify-center m-7 bg-zinc-800"
        >
          <input
            type="text"
            name="message"
            placeholder="Tweet Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Update message as user types
            className="p-2 m-2 bg-black outline-white text-white rounded-2xl"
          />
          <button type="submit" className="p-2 ml-2 bg-blue-500 text-white rounded hover:bg-blue-200 hover:cursor-pointer">
            Tweet
          </button>
        </form>
      </div>




    </div>
  );
};

export default Dashboard;
