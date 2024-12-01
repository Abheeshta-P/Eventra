"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import { imageSources } from '@/constants';
import { MdCancel } from 'react-icons/md';

function EventsCard({ eventId, eventName, eventType, date, location, className = '', isEditing, onDeleteEvent, ...props}) {
  
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = (today > date)? true : false;
  const isToday = today === date;
  const eventStatus =  isToday ? 'border-2 border-green-500 bg-green-50 text-green-700 font-semibold' : '';
  const route = useRouter();

  const displayEventDetails = (e) => {
    if (!e.target.classList.contains('deleteEvent')) {
      route.push(`/dashboard/event-creator/event/${eventId}`);
    }
  };
  const decore = eventType === 'party'?'🥳':eventType === 'wedding'?'🌸':'⚡'


  return (
    <div className={`relative flex flex-col shadow-md border border-black/10 rounded-lg w-[300px] h-[300px] bg-zinc-200 justify-between p-5 transition-opacity duration-300 cursor-pointer ${eventStatus} ${className}`}
      {...props}
      onClick={displayEventDetails}>
        {
          isCompleted && (
            <div className="absolute z-30 inset-0 flex items-center justify-center">
              <span className="text-white w-8 h-8 rounded-full bg-green-700 opacity-70 text-center text-2xl font-bold">✓</span> 
            </div>
          )
        }
       <div>
       {isEditing?<div className='absolute z-30 w-7 h-7 bg-zinc-600 text-white flex justify-center items-center rounded-full top-2 right-1 deleteEvent'>
        <button onClick={(e) => {
            e.stopPropagation(); 
            onDeleteEvent(eventId);
          }}><MdCancel className='w-4 h-4'/></button>
        </div>:null}
      
        <div className="border border-black/30 w-full h-[150px] relative">
        <img
          src={imageSources[eventType]}
          alt={eventType}
          className="object-cover w-full h-full"
        />
        </div>
      <div className="flex flex-col mt-2">
        <h1 className="font-semibold text-zinc-950 text-lg md:text-xl text-center">
          {eventName}
        </h1>
        <h3 className="text-zinc-800 text-base text-center">{eventType}{decore}</h3>
      </div>

      <div className="flex justify-between w-full text-zinc-800 text-base font-semibold">
        <h1>{location}</h1>
        <h3>{date}</h3>
      </div>
       </div>
    </div>
  );
}

export default EventsCard;
