import { Header } from "./components/Header";
import { Feed } from "./components/Feed";
import { Form } from "./components/Form";
import { useEffect, useState } from "react";
import { LoadingComp } from "./components/LoadingComp";

export const App = () => {
  const [thoughtsData, setThoughtsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState();

  // Define the API endpoint URL
  const apiUrl = "https://happy-thoughts-api-6vcl.onrender.com/thoughts";
  const fetchData = async () => {
    // Set a minimum loading time of 3 seconds
    const minimumLoadingTime = 3000;

    // Record the start time
    const startTime = Date.now();

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch thoughts");
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

  // Use the useEffect hook to run fetchData on component mount
  useEffect(() => {
    fetchData();
    // Set up a timer to fetch data periodically (every 5 seconds)
    const intervalId = setInterval(fetchData, 5000);
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Callback function for when a new thought is submitted
  const addNewThought = (newThought) => {
    const uniqueKey = Date.now();
    // Create a new thought object with the unique key
    const thoughtWithKey = {
      ...newThought,
      _id: uniqueKey, // Using `_id` for the key to avoid confusion with the `key` prop
    };
    setThoughtsData([thoughtWithKey, ...thoughtsData]);
  };

  return (
    <>
      <Header />
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
