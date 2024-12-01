"use client"
import { DashboardLayout, DetailedEventDisplayer, Loading } from '@/components';
import { resetParticipants, setInitialParticipants } from '@/store/features/participantSlice';
import { resetTodo, setInitialTodos } from '@/store/features/todoSlice';
import { eventCreatorService } from '@/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

function EventDetails({ params }) {
  const { eventId } = params;
  const dispatch = useDispatch();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = (today > event?.date)? true : false;

  useEffect(() => {
    (async () => {
      try {
        const data = await eventCreatorService.getEventDetails(eventId);
        if (!data) {
          setError("Event not found. Please check the event ID.");
        } 
        else if( data.status === 401 || data.status === 403){
          router.replace('/login')
        }
        else {
          setEvent(data.event);
          dispatch(setInitialParticipants(data.event.participants));
          dispatch(setInitialTodos(data.event.todos));
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details. Please try again later.");
      }
    })();
    return ()=>{
      dispatch(resetParticipants());
      dispatch(resetTodo());
    }
  }, [eventId,router,dispatch]);

  if (error) {
    return (
      <>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <div className="flex w-full justify-center items-center h-full">
        <Loading/>
        </div>
      </>
    );
  }

  return (
    <DashboardLayout>
      <DetailedEventDisplayer event={event} servicesAPI={event.services} participantsAPI={event.participants} isDisabled = {isCompleted}/>
    </DashboardLayout>
  );
}

export default EventDetails;
