import React from 'react';
import '../loading-spinner.css';

function loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="container-spinner">
        <div className="half"></div>
        <div className="half"></div>
      </div>
    </div>

  )
}

export default loading