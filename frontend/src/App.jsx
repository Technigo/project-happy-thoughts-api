import { Header } from "./components/Header";
import { Feed } from "./components/Feed";
import { Form } from "./components/Form";
import { useEffect, useState } from "react";
import { LoadingComp } from "./components/LoadingComp";

export const App = () => {
  // Define state variables and initialize them with default values.
  const [thoughtsData, setThoughtsData] = useState([]); // Stores thoughts data.
  const [loading, setLoading] = useState(true); // Indicates whether data is loading.
  // Store the total number of likes, retrieved from localStorage.
  const [totalLikes, setTotalLikes] = useState(
    parseInt(localStorage.getItem("totalLikes")) || 0
  );

  // Define the API endpoint URL.
  // This will return the latest 20 thoughts data from the API.
  const apiUrl = "https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts";

  // Function to fetch data from the API.
  const fetchData = async () => {
    // Set a minimum loading time of 2 seconds (2000 milliseconds)
    const minimumLoadingTime = 3000;

    // Record the start time
    const startTime = Date.now();

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to getch thoughts");
      }
      const data = await response.json();
      setThoughtsData(data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      // Calculate the elapsed time
      const elapsedTime = Date.now() - startTime;

      // Calculate the remaining time to meet the minimum loading time
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      // Delay the setLoading(false) call to meet the minimum loading time
      setTimeout(() => {
        setLoading(false);
        console.log("Success fetching data");
      }, remainingTime);
    }
  };

  // Use the useEffect hook to run fetchData on component mount.
  useEffect(() => {
    fetchData();
    // Set up a timer to fetch data periodically (every 5 seconds).
    const intervalId = setInterval(fetchData, 5000);
    // Clean up the interval when the component unmounts.
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Use the useEffect hook to save totalLikes to localStorage when it changes.
  useEffect(() => {
    localStorage.setItem("totalLikes", totalLikes.toString());
  }, [totalLikes]);

  // Callback function for when a new thought is submitted.
  const addNewThought = (newThought) => {
    const uniqueKey = Date.now(); // Use a timestamp as a unique key.
    // Create a new thought object with the unique key.
    const thoughtWithKey = {
      ...newThought,
      _id: uniqueKey, // Using `_id` for the key.
    };
    // Updating `thoughtsData` state by adding `thoughtWithKey` at the beginning of the array.
    setThoughtsData([thoughtWithKey, ...thoughtsData]);
  };

  // Render the main content of the app.
  return (
    <>
      <Header totalLikes={totalLikes} />
      <div className="main-wrapper">
        <Form
          newThought={addNewThought}
          apiUrl={apiUrl}
          fetchData={fetchData}
        />
        {loading ? (
          <LoadingComp />
        ) : (
          <Feed
            thoughtsData={thoughtsData}
            onLikeChange={(likeChange) =>
              setTotalLikes(totalLikes + likeChange)
            }
          />
        )}
      </div>
    </>
  );
};
