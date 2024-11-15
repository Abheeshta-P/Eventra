"use client"
import { Card, Container, DashboardLayout } from '@/components';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { setEventDetails } from '@/store/features/eventDetailsSlice';
import { imageSources } from '@/constants';

// EventTypes displays cards containing multiple events like wedding, party, etc.
function EventTypes() {
  const EventDetails = useSelector(state=>state.eventDetails)
  const [eventName, setEventName] = useState(''||EventDetails.eventName);
  const [location, setLocation] = useState(''||EventDetails.location);
  const [date, setDate] = useState(''||EventDetails.date);
  const [error, setError] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const dispatch = useDispatch();
  const route = useRouter();

  const handleSubmit = (e, eventType) => {
    e.preventDefault();
    
    if (!eventName || !location || !date) {
      setError('Please fill out all fields.');
      alert('Please fill out all fields.');
      return;
    }
    const formattedDate = typeof date === 'string' ? date.slice(0, 10) : new Date(date).toISOString().slice(0, 10);
    dispatch(setEventDetails({ eventName, location, date : formattedDate, eventType }));
    route.push(`/dashboard/event-creator/event-types/${eventType}/categories`)
  };

  return (
   <DashboardLayout>
     <Container className={'flex justify-center items-center flex-col'}>
      <h1 className={'mb-10 text-2xl md:text-3xl lg:text-4xl text-zinc-900 font-semibold'}>Provide event details</h1>
      
      {error && <p className="text-red-500 mb-5">{error}</p>}
      
      <form className="mb-8 w-full max-w-md flex flex-col gap-4">
        <label className="-mb-2 pl-2">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="border rounded p-2 focus:outline-[#03089a] shadow-sm"
            required
          />
        <label className="-mb-2 pl-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded p-2 focus:outline-[#03089a] shadow-sm"
            required
          />
        <label className="-mb-2 pl-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded p-2 focus:outline-[#03089a] shadow-sm"
            min={today}
            required
          />
      </form>
      <h3 className={'mb-3 text-2xl md:text-3xl  text-zinc-900 font-semibold'}>Select Event Type</h3>
      <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center w-full'}>
        <Link href='/dashboard/event-creator/event-types/wedding/categories' onClick={(e) => handleSubmit(e, 'wedding')}>
          <Card title={'Wedding'} description={'Includes various ceremonies like Engagement, Reception etc'} photo={`${imageSources.wedding}`} descriptionClass='lg:text-base' key={`${imageSources.wedding}`}/>
        </Link>
        
        <Link href='/dashboard/event-creator/event-types/party/categories' onClick={(e) => handleSubmit(e, 'party')}>
          <Card title={'Party'} description={'Includes various parties like Birthday, Farewell etc'} photo={`${imageSources.party}`} descriptionClass='lg:text-base' key={`${imageSources.party}`}/>
        </Link>
        
        <Link href='/dashboard/event-creator/event-types/entertainment/categories' onClick={(e) => handleSubmit(e, 'entertainment')}>
          <Card title={'Entertainment'} description={'Includes various entertainment types like concert, dramas etc'} photo={`${imageSources.entertainment}`} descriptionClass='lg:text-base' key={`${imageSources.entertainment}`}/>
        </Link>
      </div>
    </Container>
   </DashboardLayout>
  );
}

export default EventTypes;
