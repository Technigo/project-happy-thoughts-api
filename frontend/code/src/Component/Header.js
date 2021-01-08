import React from 'react';
import  '../Style/Header.css';

const Header = () => {
  return (
  <div className="header">
    <h1 className="header-title">
      <div className="header-title-row-1">
        <span className="header-title-1">Happy</span> 
        <span className="header-title-2">Thought</span>
      </div>
      <div>
        <span className="header-title-1">Happy</span> 
        <span className="header-title-3">Life</span>
      </div>
    </h1>
  </div>
  );
}
 
export default Header;