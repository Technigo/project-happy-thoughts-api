import React from "react";

const PrevNext = ({ skip, thoughts, nextPage, previousPage}) => {
  return (
    <div className="prevnext-buttons">
      <button className="btn prev-btn" disabled={skip === 0} onClick={previousPage}>&#60;</button>
      <button className="btn" disabled={thoughts.length !== 20} onClick={nextPage}>&#62;</button>
    </div>
  );
};

export default PrevNext;