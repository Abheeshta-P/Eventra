import React from 'react';
import '../loading-spinner.css';

function Loading({className}) {
  return (
    <div className={`w-full min-h-screen flex justify-center items-center ${className}`}>
      <div class="container-spinner">
        <div class="half"></div>
        <div class="half"></div>
      </div>
    </div>

  )
}

export default Loading