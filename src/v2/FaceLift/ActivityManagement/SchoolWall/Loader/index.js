import React from "react";
import "./index.css";
function Loader() {
  return (
    <div className="w-100 my-5 h-100 d-flex justify-content-center align-items-center">
      <div className='lds-ripple'>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
