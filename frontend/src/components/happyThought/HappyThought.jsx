import "./happythought.css";
import { TimeAgo } from "../TimeAgo";
import { useState } from "react";

export const HappyThought = ({ thought, setLikeCounter }) => {
  //State that checks if a post has been liked by the user
  const [liked, setLiked] = useState(false);

  //State that keeps track of how many likes a post has
  const [totalHearts, setTotalHearts] = useState(thought.hearts);

  //State tracking how many times a post has been liked by the user
  const [likesThisSession, setLikesThisSession] = useState(0);

  //Function that handles the user clicking the heart/like button on a post
  const handleLike = async (e) => {
    e.preventDefault();

    if (!liked) {
      setLiked(true);
    }
    setLikesThisSession((prevLikes) => prevLikes + 1);
    setLikeCounter((likesSoFar) => likesSoFar + 1);
    const options = {
      method: "POST", // Specifying the request method as POST
      // Setting the content type of the request to application/json
      headers: { "Content-Type": "application/json" },
    };

    await fetch(
      `https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts/${thought._id}/like`,
      options
    )
      .then((response) => response.json()) // Parsing the response as JSON
      .then((data) => {
        setTotalHearts(data.hearts);
      })
      // Logging any errors that occur during the fetch operation
      .catch((error) => console.log(error));
  };

  return (
    <>
      {thought ? (
        <div key={thought._id} className="post-body">
          {/* <p className="post-text">My dog Mochi 🐕‍🦺</p> */}
          <p className="post-text">{thought.message}</p>
          <div className="like-and-time">
            <div className="like-data">
              <button
                onClick={handleLike}
                className="likeBtn"
                style={{ backgroundColor: !liked ? "pink" : "#ee8bb4" }}
              >
                <span className="like-heart-emoji">🧡</span>
              </button>
              <p className="total-likes">x {totalHearts}</p>
            </div>
            <p className="time-of-post">
              {<TimeAgo timestamp={thought.createdAt} />}
            </p>
          </div>
          <p
            className="like-counter"
            style={{ display: likesThisSession > 0 ? "flex" : "none" }}
          >
            You have liked this post {likesThisSession} times.
          </p>
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
};
