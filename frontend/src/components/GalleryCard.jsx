"use client"
import React, { useState } from 'react';
import { MdCancel } from 'react-icons/md';

function GalleryCard({ imgSrc, isEditing = false, onDelete = () => {}, ...props }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative gallery-card w-full h-48 rounded-lg overflow-hidden shadow-md bg-white" {...props}>
      {/* Show delete button if editing */}
      {isEditing && (
        <div className="absolute z-30 w-7 h-7 bg-zinc-600 text-white flex justify-center items-center rounded-full top-2 right-1">
          <button onClick={onDelete}>
            <MdCancel className="w-4 h-4" />
          </button>
        </div>
      )}


      <img
        src={imgSrc}
        alt={`Gallery Image - ${imgSrc}`}
        className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
          isLoading ? 'hidden' : 'block'
        }`}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
}

export default GalleryCard;

