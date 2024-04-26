import "./Header.css";
import { IoLogoGithub } from "react-icons/io";

// Define a functional component named Header that takes a prop totalLikes.
export const Header = () => {
  return (
    <header>
      {/* Render the name of the project and GitHub link */}
      <div className="project-name">
        <a href="https://github.com/JuliaHolm">Julia Holm</a>
        <a href="https://github.com/JuliaHolm">
          {/* Render the GitHub icon */}
          <IoLogoGithub className="github-icon" />
        </a>
        <p>Technigo Project Happy Thoughts</p>
      </div>
      <img
        src="./heart-likes.png"
        alt="Heart icon"
        className="heart-likes-icon"
      />
    </header>
  );
};
