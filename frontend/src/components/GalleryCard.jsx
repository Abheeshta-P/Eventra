import React from 'react';

function GalleryCard({ imgSrc,...props }) {
  return (
    <div className="gallery-card w-full h-48 rounded-lg overflow-hidden shadow-md bg-white" {...props}>
      <img 
        src={imgSrc} 
        alt="Gallery Image" 
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}

export default GalleryCard;
