import React from 'react'
import { GalleryCard } from '@/components'

const eventCategoryImageSources = {
  'Cakeshop' : '/serviceCategory/cakeshop.jpg',
  'Decorating' : '/serviceCategory/decor.jpg',
  'Photography': '/serviceCategory/photography.jpeg', 
  'Venue' : '/serviceCategory/venue.jpg', 
  'Music' : '/serviceCategory/music.JPG', 
  'Emcee' : '/serviceCategory/emcee.jpg', 
  'Makeup' : '/serviceCategory/makeup.jpg', 
  'Catering' : '/serviceCategory/cater.jpg', 
}

// edit and add images is remaining
function GalleryOfService() {
  // const galleryImages => from api call
  const galleryImages = Object.values(eventCategoryImageSources);
  return (
    <div className='-mt-2 -mb-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-4'>
      {
        galleryImages?.map(imgSrc=>(
          <GalleryCard imgSrc={imgSrc} key={imgSrc}/>
        ))
      }
    </div>
  )
}

export default GalleryOfService