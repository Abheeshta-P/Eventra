"use client"
import React, { useRef } from 'react';
import { ServicesCard } from '.';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

function ServicesList({ services }) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -350, 
      behavior: 'smooth',
    });
  };
  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 350, 
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative w-full">
       {
        services?.length>1 ?  
      <button
        onClick={scrollLeft}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
      >
        <HiChevronLeft size={24} />
      </button>
      : null
    }
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-scroll scrollbar-hide space-x-4 px-6 py-4 pr-0 lg:justify-center w-full"
        style={{ scrollBehavior: 'smooth' }}
      >
        {services?.map((service) => (
          <ServicesCard service={service} key={service.email} />
        ))}
      </div>
      {
        services?.length>1 ?  
        <button
        onClick={scrollRight}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
      >
        <HiChevronRight size={24} />
      </button> : null
      }
    </div>
  );
}

export default ServicesList;
