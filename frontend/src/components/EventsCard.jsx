"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import { imageSources } from '@/constants';
import { MdCancel } from 'react-icons/md';

function EventsCard({ eventId, eventName, eventType, date, location, className = '', isEditing, onDeleteEvent, ...props}) {
  
  const today = new Date().toISOString().split('T')[0];
  const isToday = today === date;
  const eventStatus = isToday ? 'border-2 border-green-500 bg-green-50 text-green-700 font-semibold' : '';
  const route = useRouter();
  const displayEventDetails = (e) => {
    if (!e.target.classList.contains('deleteEvent')) {
      route.push(`/dashboard/event-creator/event/${eventId}`);
    }
  };
  return (
    <div className={`relative flex flex-col shadow-xs hover:border-zinc-400 border border-zinc-300 rounded-xl w-full max-w-[320px] bg-zinc-100 justify-between p-3.5 transition-all duration-200 cursor-pointer ${eventStatus} ${className}`}
      {...props}
      onClick={displayEventDetails}>
       <div>
       {isEditing?<div className='absolute z-30 w-7 h-7 bg-zinc-600 text-white flex justify-center items-center rounded-full top-2 right-1 deleteEvent'>
        <button onClick={(e) => {
            e.stopPropagation(); 
            onDeleteEvent(eventId);
          }}><MdCancel className='w-4 h-4'/></button>
        </div>:null}
      
        <div className="border border-zinc-300 rounded-lg overflow-hidden w-full h-[140px] relative">
        <img
          src={imageSources[eventType]}
          alt={eventType}
          className="object-cover w-full h-full"
        />
        </div>
      <div className="flex flex-col mt-2">
        <h1 className="font-bold text-zinc-950 text-base text-center truncate">
          {eventName}
        </h1>
        <h3 className="text-zinc-600 text-xs text-center capitalize">{eventType}</h3>
      </div>
      <div className="flex justify-between items-center w-full text-zinc-600 text-xs font-medium pt-2 mt-2 border-t border-zinc-200">
        <span className="truncate">{location}</span>
        <span className="shrink-0 font-semibold text-zinc-800">{date}</span>
      </div>
       </div>
    </div>
  );
}
export default EventsCard;