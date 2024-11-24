"use client"
import { Container, DashboardLayout, GalleryCard } from '@/components'
import { eventCreatorService } from '@/utils'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function ServiceDetail({ params }) {
  const { serviceId } = params;
  const [service,setServiceDetails] = useState({});
  const router = useRouter();
  useEffect(()=>{
    ;(async ()=>{
      try {
        const service = await eventCreatorService.getServiceDetails(serviceId);
        if (service) {
          setServiceDetails(service);
        } 
        else if( service.status === 401 || service.status === 403){
          router.replace('/login')
        }
      } catch (error) {
        console.error("Error fetching service details :: serviceDetails Display :: frontend", error);
        return (
              <DashboardLayout>
                <Container className="mb-5">
                  <div className="flex flex-col items-center justify-center text-red-600">
                    <h2 className="text-2xl font-semibold">Error</h2>
                    <p>{error.message || 'Failed to load service details.'}</p>
                  </div>
                </Container>
              </DashboardLayout>
            );
      }
    })()
  },[router,serviceId])


  return (
    <DashboardLayout>
      <Container className="mb-5">
        <div className="flex flex-col px-3 md:px-8 w-full justify-center items-center gap-6">
          <div className="flex flex-col justify-center items-center md:gap-3">
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-950 text-center text-nowrap">
              {service?.name}
            </h1>
            <h3 className="text-lg text-zinc-500 md:text-xl">{service?.category}</h3>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 w-full">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 text-nowrap">Details</h2>
            <div className="text-zinc-700 text-base">{service?.details}</div>
            <div className="text-zinc-700 text-base">Based on : {service?.location}</div>
            <div className="text-zinc-700 text-base">Phone : {service?.phone}</div>
            <div className="text-zinc-700 text-base">Email : {service?.email}</div>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 w-full">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 text-nowrap">Gallery</h2>
            {
              service?.galleryImages?.length === 0 ? <div className='mb-12'>
              <p className="text-sm md:text-base text-zinc-700">
                No gallery images yet.
              </p>
              </div> : <div className="-mt-2 -mb-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-4">
              {service?.galleryImages?.map((imgSrc) => (
                <GalleryCard imgSrc={imgSrc} key={imgSrc} />
              ))}
            </div>
            }
          </div>
          <div className="flex items-center mb-3">
            <p className="text-xl md:text-2xl font-semibold text-green-800">
              <span className="mr-4">Estimated Cost : ₹</span>{service?.estimatedCost}
            </p>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}

export default ServiceDetail;
