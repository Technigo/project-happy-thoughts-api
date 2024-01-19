import { HappyThought } from "../happyThought/HappyThought";
import "./happythoughtsfeed.css";

export const HappyThoughtsFeed = ({ thoughts, setLikeCounter }) => {
  return (
    <div className="thought-feed">
      {thoughts.map((oneThought) => (
        <HappyThought
          key={oneThought._id}
          thought={oneThought}
          setLikeCounter={setLikeCounter}
        />
      ))}
    </div>
  );
};
