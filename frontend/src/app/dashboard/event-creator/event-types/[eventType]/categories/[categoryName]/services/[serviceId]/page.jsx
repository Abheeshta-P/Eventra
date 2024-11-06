import { Container, DashboardLayout, GalleryCard } from '@/components'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineTag } from 'react-icons/hi';
import React from 'react'

async function ServiceDetail() {
  // fetch the details and gallery via api
  const service = {
    name: "Canara Decor",
    details: `
      At Canara Decor, we specialize in transforming venues into stunning spaces that reflect your unique vision and style. Our mission is to create an enchanting atmosphere for your special day, ensuring that every detail contributes to the overall experience.
      
      From the excitement of planning to the final reveal, we meticulously craft decor elements that resonate with your personal taste. Our team understands that weddings are a celebration of love, family, and friendship, and we strive to reflect this joy through our designs.
      
      During the planning phase, we collaborate closely with couples to curate personalized decor experiences that highlight their personalities and the essence of their love story. We encourage creativity, offering various themes, colors, and styles to ensure your venue becomes a true reflection of who you are as a couple.
    `,
    email: "canaradecor@example.com",
    phone: 8124567895,
    category: "Decorating",
    location: "Bantwal, Karnataka",
    estimatedCost: 50000,
    galleryImages: [
      '/serviceCategory/cakeshop.jpg',
      '/serviceCategory/decor.jpg',
      '/serviceCategory/photography.jpeg',  '/serviceCategory/venue.jpg', 
      '/serviceCategory/music.JPG', 
      '/serviceCategory/emcee.jpg', 
      '/serviceCategory/makeup.jpg', 
      '/serviceCategory/purohit.webp'
    ],
  };
  

  return (
    <DashboardLayout>
       <Container className={'mb-5'}>
       <div className="flex flex-col px-3 md:px-8 w-full justify-center items-center gap-6">
       <div className="flex flex-col justify-center items-center md:gap-3">
          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-950 text-center text-nowrap">{service.name}</h1>
          <h3 className="text-lg text-gray-600 md:text-xl">{service.category}</h3>
      </div>
      <div className='flex flex-col gap-2 md:gap-3 w-full'>
      <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 text-nowrap">Details</h2>
      <div className='text-zinc-600 text-base'>
        {service.details}
      </div>
      <div className='text-zinc-600 text-base'>
        Based on : {service.location}
      </div>
      <div className='text-zinc-600 text-base'>
        Phone : {service.phone}
      </div>
      <div className='text-zinc-600 text-base'>
        Email : {service.email}
      </div>
      </div>
     <div className='flex flex-col gap-2 md:gap-3 w-full'>
     <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 text-nowrap">Gallery</h2>
     <div className='-mt-2 -mb-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-4'>
      {
        service?.galleryImages.map(imgSrc=>(
          <GalleryCard imgSrc={imgSrc} key={imgSrc}/>
        ))
      }
      </div>
     </div>
      <div className="flex items-center mb-3">
        <p className="text-xl md:text-2xl font-semibold text-green-800"><span className='mr-4'>Estimated Cost : ₹</span>{service?.estimatedCost}</p>
      </div>
      </div>
      </Container>
    </DashboardLayout>
  )
}

export default ServiceDetail