"use client"
import { useRouter } from 'next/navigation';
import React from 'react';

function EventsCard({ eventName, eventType, date, location, className = '', ...props}) {

  const route = useRouter();
  const imageSources = {
    wedding: '../../eventType/wedding.jpg',
    party: '../../eventType/party.jpg',
    entertainment: '../../eventType/concert.jpg'
  };


  const editEvent = () =>{
    route.push('/')
  }

  return (
    <div
      className={`relative flex flex-col shadow-md border border-black/10 rounded-lg w-[300px] h-[300px] bg-zinc-100 justify-between p-5 transition-opacity duration-300 ${className}`}
      {...props}
    >
    
      {/* Edit button at top-right */}
      <button className="absolute top-0 right-0" onClick={editEvent}>
        <img src="../../eventType/edit.svg" alt="edit" className='w-6' />
      </button>

      {/* Event Image */}
      <div className="border border-black/30 w-full h-[150px]">
        <img
          src={imageSources[eventType]}
          alt={eventType}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Event Details */}
      <div className="flex flex-col mt-2">
        <h1 className="font-semibold text-zinc-900 text-lg md:text-xl text-center">
          {eventName}
        </h1>
        <h3 className="text-zinc-800 text-base text-center">{eventType}</h3>
      </div>

      {/* Location and Date */}
      <div className="flex justify-between w-full">
        <h1 className="text-zinc-700 text-base font-semibold">{location}</h1>
        <h3 className="text-zinc-700 text-base font-semibold">{date}</h3>
      </div>
    </div>
  );
}

export default EventsCard;
