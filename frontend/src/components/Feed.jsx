// Import necessary styles and components.
import "./Feed.css";
import { EachThought } from "./EachThought";

// Define the Feed component that accepts props: thoughtsData and onLikeChange.
export const Feed = ({ thoughtsData, onLikeChange }) => {
  // Render the feed section.
  return (
    <section className="feed-container">
      {thoughtsData.map((eachThought) => {
        return (
          // Render EachThought component for each thought in thoughtsData.
          <EachThought
            key={eachThought._id} // Assign a key prop to each thought for React optimization.
            eachThought={eachThought} // Pass each thought as a prop to EachThought component.
            onLikeChange={onLikeChange} // Pass onLikeChange function as a prop.
          />
        );
      })}
    </section>
  );
};
