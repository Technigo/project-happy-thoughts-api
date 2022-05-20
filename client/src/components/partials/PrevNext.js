import React from "react";

const PrevNext = ({ skip, setSkip, thoughts, fetchThoughts }) => {
  const handleNextClick = () => {
    setSkip(skip + 20);
    fetchThoughts();
  };

  const handlePrevClick = () => {
    setSkip(skip - 20);
    fetchThoughts();
  };

  return (
    <div className="prevnext-buttons">
      <button className="btn prev-btn" disabled={skip === 0} onClick={() => handlePrevClick()}>&#60;</button>
      <button className="btn" disabled={thoughts.length !== 20} onClick={() => handleNextClick()}>&#62;</button>
    </div>
  );
};

export default PrevNext;