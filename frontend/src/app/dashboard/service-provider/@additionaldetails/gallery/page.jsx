"use client"
import React, {useState,useRef, useEffect} from 'react';
import { GalleryCard, DashboardLayout, Loading } from '@/components';
import { MdEdit, MdSave,MdAdd} from 'react-icons/md'; 
import serviceProviderService from '@/utils/serviceProvider';

function GalleryOfService() {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [isEditing,setisEditing] = useState(false);
  const [galleryImages,setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(()=>{
    ;(async ()=>{
      try {
        const response = await serviceProviderService.getGalleryImages();
        if (response.status === 403 || response.status === 401) {
          router.push('/login'); 
          return;
        }
  
        if (response) {
          setGallery(response.gallery);
        } 
        else {
          setError(response.error); 
        }
      } catch (error) {
        console.error("Error fetching gallery images :: gallery of service Display :: frontend", error);
        setError("Failed to load gallery images. Please try again later.");
      } finally{
        setLoading(false)
      }
    })()
  },[])

  if (error) {
    return (
      <DashboardLayout>
        <div className="w-full flex justify-center items-center h-full">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if(loading) 
    return (
      <div className="w-full flex justify-center items-center h-full">
      <Loading/>
      </div>
    )

  return (
      <div>
         <div className='absolute w-7 h-7 bg-zinc-600 text-white flex justify-center items-center rounded-full top-2 right-1'>
        <button onClick={editGallery}> {isEditing?<MdSave className='w-4 h-4'/>:<MdEdit className='w-4 h-4'/>}</button>
       </div>
      {
        galleryImages.length === 0?
        <div className='w-full h-full flex justify-center items-center flex-col'>
        <p className='text-sm md:text-base text-zinc-700'>No images yet. Tap on edit button to add gallery images</p>
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
        </div> :
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
      }
   </div>
  )
}

export default GalleryOfService