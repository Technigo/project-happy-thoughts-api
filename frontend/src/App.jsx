import { useEffect, useState } from "react";
import { HappyThoughtsFeed } from "./components/happyThoughtsFeed/HappyThoughtsFeed";
import { WriteAPost } from "./components/writeAPost/WriteAPost";
import loader from "./assets/loader.gif";

export const App = () => {
  //State that tracks if the data from the API is loading
  const [loading, setLoading] = useState(true);

  // State that tracks the post information from the API
  const [thoughtCollection, setThoughtCollection] = useState([]);

  // A state that tracks the total amount of global likes during a session
  const [likeCounter, setLikeCounter] = useState(0);

  //The API connection string
  // const thoughtAPI = "https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts";
  const thoughtAPI = "https://happy-thoughts-api-backend.onrender.com/thoughts";
  //The call to the API
  const callAPi = async () => {
    await fetch(thoughtAPI)
      .then((data) => data.json())
      .then((jsonData) => {
        setThoughtCollection(jsonData);
        setLoading(!loading);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    callAPi();
  }, []);

  //Adds a new post to the beginning of the thougtCollection
  const addNewPost = (newPost) => {
    setThoughtCollection([newPost, ...thoughtCollection]);
  };

  return (
    <div className="container">
      <h1>Project Happy Thoughts</h1>
      <h3>
        The total amount of likes you've given out so far this session is:{" "}
        {likeCounter}
      </h3>
      <WriteAPost addNewPost={addNewPost} />
      {loading ? (
        <img className="loader" src={loader} alt="loading-gif" />
      ) : (
        <HappyThoughtsFeed
          thoughts={thoughtCollection}
          setLikeCounter={setLikeCounter}
        />
      )}
    </div>
  );
};
