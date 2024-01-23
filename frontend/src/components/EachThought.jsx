// Import necessary hooks and libraries.
import { useEffect, useState } from "react";
import moment from "moment"; // Import moment library for date formatting.

// Define the EachThought component that accepts props: eachThought and onLikeChange.
export const EachThought = ({ eachThought, onLikeChange }) => {
  // Define state variables for liked status and number of likes.
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(eachThought.hearts);

  // Define the API endpoint for liking a thought.
  const onLikeApi = `https://happy-thoughts-api-6vcl.onrender.com/thoughts/${eachThought._id}/like`;

  // Use the useEffect hook to check if the thought is liked by the user and set liked accordingly.
  useEffect(() => {
    // Retrieve liked thoughts from localStorage or initialize an empty array.
    const likedThoughts =
      JSON.parse(localStorage.getItem("likedThoughts")) || [];
    if (likedThoughts.includes(eachThought._id)) {
      setLiked(true); // Set liked to true if the thought is in the likedThoughts array.
    }
  }, [eachThought._id]);

  // Function to toggle the like status of a thought.
  const toggleLike = async () => {
    if (!liked) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await fetch(onLikeApi, options);

        if (response.ok) {
          // Increment the number of likes, set liked to true, and update the parent component.
          const updatedLikes = numLikes + 1;
          setNumLikes(updatedLikes);
          setLiked(true);
          onLikeChange(1); // Notify the parent of the like change.
        } else {
          // Log the response status and any response data or error messages.
          const responseData = await response.json();
          console.error("Failed to like the thought. Status:", response.status);
          console.error("Response data:", responseData);
        }
      } catch (error) {
        // Log any network or unexpected errors.
        console.error("An error occurred while liking the thought:", error);
      }
    }
  };

  return (
    <div className="posted-thought">
      <p>{eachThought.message}</p>
      <div className="heart-time-container">
        <div className="likes">
          {/* Button to toggle liking a thought */}
          <button
            onClick={toggleLike}
            className={`likes-btn ${liked ? "liked" : ""}`}
          >
            <img src="./icons8-heart-64.png" alt="" />
          </button>
          {/* Display the number of likes */}
          <p>x {numLikes}</p>
        </div>
        {/* Display the timestamp of when the thought was created */}
        <p key={eachThought._id}>{moment(eachThought.createdAt).fromNow()}</p>
      </div>
    </div>
  );
};
