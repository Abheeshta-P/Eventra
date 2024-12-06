"use client";
import { useState } from 'react';
import Swal from 'sweetalert2';
import React from 'react';
import { Container, ParticipantList, ServicesList, Button, TodoList, Loading } from '..';
import { useDispatch, useSelector } from 'react-redux';
import { resetEventDetails } from '@/store/features/eventDetailsSlice';
import { resetTodo } from '@/store/features/todoSlice';
import { canvaLink } from '@/constants';
import { useRouter } from 'next/navigation';
import { eventCreatorService } from '@/utils';
import { setEvents } from '@/store/features/eventsSlice';
import { resetParticipants } from '@/store/features/participantSlice';

function DetailedEventDisplayer({ event, isCreating = false, servicesAPI, isDisabled = false }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [hasChanges, setHasChanges] = useState(false);
  const participants = useSelector(state => state.participantsList.participantList);
  const todos = useSelector((state) => state.todoList.todos);
  const { userData } = useSelector((state) => state.auth);
  const [sending, setSending] = useState(false);


  const designInCanva = () => {
    if (canvaLink[event.eventType]) {
      window.open(canvaLink[event.eventType], '_blank');
    } else {
      Swal.fire('Error', 'Canva link for this event type does not exist.', 'error');
    }
  };

  const handleConfirm = async () => {
    Swal.fire({
      title: 'Confirm Event Creation',
      text: "Service providers will be notified and you'll receive their details.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#03089a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSending(true);
        try {
          const response = await eventCreatorService.createEvent({
            eventName: event.eventName,
            location: event.location,
            date: event.date,
            eventType: event.eventType,
            services: servicesAPI,
            participants,
            todos,
            creatorEmail: userData?.email,
          });
          if (response) {
            dispatch(setEvents(response.userEvents));
            Swal.fire('Event Created!', 'Event and notifications successfully processed.', 'success');
            router.replace('/dashboard/event-creator');
            dispatch(resetEventDetails());
            dispatch(resetTodo());
            dispatch(resetParticipants());
          }
        } catch (error) {
          console.error("Error creating event :: detailed event Display :: frontend", error);
          Swal.fire('Error', 'Event creation failed.', 'error');
        } finally {
          setSending(false);
        }
      }
    });
  };

  
const handleSave = async () => {
    setSending(true);
    try {
      const response = await eventCreatorService.updateEventDetails(event._id, {
        participants,
        todos,
      });
      if (response) {
        Swal.fire('Success', 'Changes saved successfully.', 'success');
        setHasChanges(false); 
      } 
      else if( response.status === 401 || response.status === 403){
        router.replace('/login')
      }
      else {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      console.error("Error updating todo participants details :: detailed event Display :: frontend", error);
      Swal.fire('Error', 'Failed to save changes. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  if (sending) return <Loading />;
  return (
    <Container className="mb-5">
      <div className="flex flex-col px-3 md:px-8 w-full justify-center items-center gap-6">
        <div className="flex flex-col justify-center items-center md:gap-3">
          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-950 text-center">{event.eventName}</h1>
          <h3 className="text-lg text-gray-600 md:text-xl">{event.eventType}</h3>
        </div>
        <div className="flex justify-between w-full mt-2 text-base md:text-xl">
          <p className="text-gray-700">{event.date}</p>
          <p className="text-gray-700">{event.location}</p>
        </div>

        <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold">Services</h2>
        <ServicesList services={servicesAPI} />

        <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold mt-8">Invitees List</h2>
        <ParticipantList setHasChanges={setHasChanges} isDisabled={isDisabled}/>

        <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold mt-8">Todo List</h2>
        <TodoList setHasChanges={setHasChanges} isDisabled={isDisabled}/>

       
        {isCreating ? (
          <>
            <Button className="flex items-center justify-center gap-2 mt-4 bg-zinc-800" onClick={designInCanva}>
              <span>
                <img src="/canva.png" alt="canva" className="w-6" />
              </span>
              <p>Create Design</p>
            </Button>
            <Button className="font-bold md:px-12 md:py-2" onClick={handleConfirm}>
              Confirm
            </Button>
          </>
        ) : (
          hasChanges && (
            <Button className="font-bold md:px-12 md:py-2" onClick={handleSave}>
              Save
            </Button>
          )
        )}
      </div>
    </Container>
  );
}

export default DetailedEventDisplayer;
