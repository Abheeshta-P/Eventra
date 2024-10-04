import React from 'react';
import '../loading-spinner.css';

function Loading({className}) {
  return (
    <div className={`w-full min-h-screen flex justify-center items-center ${className}`}>
      <div className="container-spinner">
        <div className="half"></div>
        <div className="half"></div>
      </div>
    </div>

  )
}

export default Loading