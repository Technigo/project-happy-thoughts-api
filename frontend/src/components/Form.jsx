// Import necessary hooks and CSS file.
import { useEffect, useState } from "react";
import "./Form.css";

// Define the Form component that accepts props: newThought, fetchData, and apiUrl.
export const Form = ({ newThought, fetchData, apiUrl }) => {
  // Define state variables for the component.
  const [newPost, setNewPost] = useState(""); // Stores the text input value.
  const [errorMessage, setErrorMessage] = useState(""); // Stores error messages, if any.

  // Use the useEffect hook to check the length of newPost and set an error message if needed.
  useEffect(() => {
    // Check if the length of newPost is 141 or more characters.
    if (newPost.length >= 141) {
      // Set an error message if it's too long.
      setErrorMessage("Your message is too long 😔");
    } else {
      // Clear the error message if it's not too long.
      setErrorMessage("");
    }
  }, [newPost]); // Dependency array includes newPost, so the effect runs when newPost changes.

  // Function for handling form submission.
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior.

    // Check if the length of newPost is shorter than 5 characters.
    if (newPost.length <= 4) {
      // Set an error message if it's too short.
      setErrorMessage(
        "Your message is too short, it needs at least 5 letters 😔"
      );
    } else if (newPost.length >= 141) {
      // Set an error message if it's too long.
      setErrorMessage("Your message is too long 😔");
    } else {
      // Define options for the fetch request.
      const options = {
        method: "POST", // Specify the request method as POST.
        body: JSON.stringify({
          message: `${newPost}`, // Stringify newPost and set it as the request body.
        }),
        headers: { "Content-Type": "application/json" }, // Set the content type of the request to application/json.
      };

      // Make a POST request to the API endpoint with the configured options.
      await fetch(apiUrl, options)
        .then((response) => response.json()) // Parse the response as JSON.
        .then((data) => {
          // Call the newThought function (passed as a prop) with the parsed data.
          newThought(data);
          // Reset newPost to an empty string, clearing the textarea.
          setNewPost("");
          // Call the fetchData function (passed as a prop) to re-fetch posts.
          fetchData();
          // Log the current value of newPost for debugging.
          console.log("newPost onformsubmit:", newPost);
        })
        // Log any errors that occur during the fetch.
        .catch((error) => console.log(error));
    }
  };

  // Render the form component.
  return (
    <div className="form-container">
      <h1>What's making you happy right now?</h1>
      <form onSubmit={handleFormSubmit}>
        {/* Textarea input for entering the happy thought */}
        <textarea
          rows="3"
          placeholder="Something that makes you happy right now..."
          value={newPost}
          onChange={(event) => setNewPost(event.target.value)}
        />
        <div className="post-lenght">
          {/* Display the error message, if any */}
          <p className="error-message">{errorMessage}</p>
          {/* Display the character count and change the text color if it exceeds 140 characters */}
          <p className={`length ${newPost.length >= 140 ? "red" : ""}`}>
            {newPost.length}/140
          </p>
        </div>
        {/* Submit button for submitting the happy thought */}
        <button
          type="submit"
          className="submit-btn"
          aria-label="Button for submiting your thought"
        >
          <span>❤️</span>
          Send Happy Thought
          <span>❤️</span>
        </button>
      </form>
    </div>
  );
};
