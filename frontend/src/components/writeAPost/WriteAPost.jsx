import "./writeapost.css";
import { useState, useEffect } from "react";

export const WriteAPost = ({ addNewPost }) => {
  //State that keeps track of the total characters entered by the user
  const [totalCharacters, setTotalCharacters] = useState(0);

  //State that determines if user inputs too many or too few characters for a post
  const [characterLimit, setCharacterLimit] = useState(false);

  //State that gets updated with an error message and displayed to the user
  const [errorMessage, setErrorMessage] = useState("");

  //State that tracks new post message
  const [postData, setPostData] = useState("");

  //Function that gets called when user presses button
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (totalCharacters < 5) {
        setCharacterLimit(true);
        setErrorMessage("Your message needs to be longer than 5 characters 🤖");
        return;
      }

      const options = {
        method: "POST",
        body: JSON.stringify({
          message: `${postData}`,
        }),
        headers: { "Content-Type": "application/json" },
      };

      await fetch(
        `https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          addNewPost(data);
        })
        .catch((error) => console.log(error));

      setPostData("");
      setTotalCharacters(0);
    } catch (e) {
      console.log("Error: " + e);
    }
  };

  useEffect(() => {
    if (totalCharacters > 140) {
      setCharacterLimit(true);
      setErrorMessage("Your message is too long 😔");
    } else if (totalCharacters <= 140) {
      setCharacterLimit(false);
      setErrorMessage("");
    }
  }, [totalCharacters]);

  return (
    <div className="editor-container">
      <h2>What is making you happy right now?</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          type="text"
          className="comment-box"
          value={postData}
          placeholder="'If music be the food of love, play on.' - William Shakespeare"
          onChange={(e) => {
            setTotalCharacters(e.target.value.length);
            setPostData(e.target.value);
          }}
        />
        <div
          className="postInfo"
          style={{
            justifyContent: characterLimit ? "space-between" : "flex-end",
          }}
        >
          <p
            className="messageTooLong"
            style={{ display: characterLimit ? "flex" : "none" }}
          >
            {errorMessage}
          </p>
          <p
            className="charCount"
            style={{ color: characterLimit ? "red" : "grey" }}
          >
            {totalCharacters}/140
          </p>
        </div>
        <button type="submit" className="sendPostBtn">
          <span className="emoji"> 🧡</span>Send Happy Thought
          <span className="emoji"> 🧡</span>
        </button>
      </form>
    </div>
  );
};
