"use client";
import { Container, DashboardLayout } from '@/components';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setEventDetails } from '@/store/features/eventDetailsSlice';

function EventTypes() {
  const EventDetails = useSelector((state) => state.eventDetails);
  const [eventName, setEventName] = useState('' || EventDetails.eventName);
  const [location, setLocation] = useState('' || EventDetails.location);
  const [date, setDate] = useState('' || EventDetails.date);
  const [eventType, setEventType] = useState('');
  const [error, setError] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const dispatch = useDispatch();
  const route = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!eventName || !location || !date || !eventType) {
      setError('Please fill out all fields.');
      alert('Please fill out all fields.');
      return;
    }

    const formattedDate =
      typeof date === 'string' ? date.slice(0, 10) : new Date(date).toISOString().slice(0, 10);
    dispatch(setEventDetails({ eventName, location, date: formattedDate, eventType }));
    route.push(`/dashboard/event-creator/event-types/${eventType}/categories`);
  };

  return (
    <DashboardLayout>
      <Container className="flex justify-center items-center flex-col">
        <h1 className="mb-10 text-2xl md:text-3xl lg:text-4xl text-zinc-900 font-semibold">
          Provide Event Details
        </h1>

        {error && <p className="text-red-500 mb-5">{error}</p>}

        <form
          className="mb-8 w-full max-w-md flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <label className="-mb-2 pl-2">Event Name</label>
          <input
            type="text"
            placeholder="Eg : John's wedding"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="border rounded p-2 focus:outline-[#03089a] shadow-sm"
            required
          />
          <label className="-mb-2 pl-2">Event Type</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="border rounded p-2 focus:outline-[#03089a] shadow-sm"
            required
          >
            <option value="" disabled>
              Select an event type
            </option>
            <option value="wedding">Wedding (Engagement, Reception...)</option>
            <option value="party">Party (Birthday, Farewell ...)</option>
            <option value="entertainment">Entertainment (concert, dramas...)</option>
          </select>
          <label className="-mb-2 pl-2">Location</label>
          <input
            type="text"
            placeholder="Eg : Mangalore"
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
          
          <button
            type="submit"
            className="bg-[#03089a] text-white rounded p-2 shadow hover:bg-[#010569]"
          >
            Next ➡️
          </button>
        </form>
      </Container>
    </DashboardLayout>
  );
}

export default EventTypes;
