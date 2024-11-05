"use client"
import React, {useState,useRef} from 'react';
import { GalleryCard } from '@/components';
import { MdEdit, MdSave,MdAdd} from 'react-icons/md'; 

const eventCategoryImageSources = {
  'Cakeshop' : '/serviceCategory/cakeshop.jpg',
  'Decorating' : '/serviceCategory/decor.jpg',
  'Photography': '/serviceCategory/photography.jpeg', 
  'Venue' : '/serviceCategory/venue.jpg', 
  'Music' : '/serviceCategory/music.JPG', 
  'Emcee' : '/serviceCategory/emcee.jpg', 
  'Makeup' : '/serviceCategory/makeup.jpg', 
  'Purohit' : '/serviceCategory/purohit.webp'
}

function GalleryOfService() {
  // const galleryImages => from api call
  const fileInputRef = useRef(null);
  const [isEditing,setisEditing] = useState(false);
  const [galleryImages,setGallery] = useState(Object.values(eventCategoryImageSources));
  const editGallery = ()=>{
    if(isEditing){
      // call db to update the gallery
      // after that update the redux as well
      console.log("called db")
    }
    setisEditing(prev=>!prev)
  }

  const onDelete = (imgSrc) => {
    // delete the image from local useState using the src 
    setGallery((prevImages) => prevImages.filter((src) => src !== imgSrc));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (galleryImages.length + files.length > 8) {
      alert("You can only upload a maximum of 8 images.");
      fileInputRef.current.value = ''; 
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file)); 
    setGallery((prevImages) => [...prevImages, ...newImages]);
    fileInputRef.current.value = ''; 
  };
  return (
      <div>
         <div className='absolute w-7 h-7 bg-zinc-600 text-white flex justify-center items-center rounded-full top-2 right-1'>
        <button onClick={editGallery}> {isEditing?<MdSave className='w-4 h-4'/>:<MdEdit className='w-4 h-4'/>}</button>
       </div>
     <div className='-mt-2 -mb-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-4'>
      {
        galleryImages?.map(imgSrc=>(
          <GalleryCard imgSrc={imgSrc} key={imgSrc} isEditing={isEditing} onDelete={() => onDelete(imgSrc)}/>
        ))
      }
      {isEditing&&galleryImages.length<8?
      <div className='w-full h-48 flex items-center justify-center'> 
      <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          /><button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center p-2 bg-zinc-600 text-white rounded-full shadow hover:bg-zinc-700 transition"
          >
            <MdAdd className='w-12 h-12'/>
          </button> </div>:null}    
      </div>
   </div>
  )
}

export default GalleryOfService