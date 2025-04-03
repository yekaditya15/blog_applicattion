import React from "react";
import "../styles/Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner-overlay" data-testid="spinner">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
