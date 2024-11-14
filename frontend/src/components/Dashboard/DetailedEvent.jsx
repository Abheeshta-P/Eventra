"use client"
import { useState } from 'react'
import Swal from 'sweetalert2'
import React from 'react'
import { Container,ParticipantList,ServicesList,Button, TodoList } from '..'
import { useDispatch, useSelector } from 'react-redux'
import { resetEventDetails } from '@/store/features/eventDetailsSlice';
import { resetTodo } from '@/store/features/todoSlice'
import { canvaLink } from '@/constants'
import { useRouter } from 'next/navigation'

function DetailedEventDisplayer({ event, isCreating = false, servicesAPI }) {
  const router = useRouter();
  const dispatch = useDispatch();
  // api call,
  // get services based on event id in dashboard is got inside event from previos route or parent 
  //BUT IF on creation this component used then
  // get service details based on email stored in event.selectedCategories all service email id
  let services =  [
    {
      "category": "Catering",
      "name": "Delicious Catering Co.",
      "cost": 50000,
      "email": "info@deliciouscatering.com",
      "phone": "9876543210",
      "location" : "mankude"
    },
    {
      "category": "Photography",
      "name": "Capturing Moments",
      "cost": 20000,
      "email": "contact@capturingmoments.com",
      "phone": "9123456789",
      "location" : "mankude"
    }
    ,
    {
      "category": "Photography",
      "name": "Capturing Moments",
      "cost": 20000,
      "email": "contact@caturingmoments.com",
      "phone": "9123456789",
      "location" : "mankude"
    }
    ,
    {
      "category": "Photography",
      "name": "Capturing Moments",
      "cost": 20000,
      "email": "contact@capuringmoments.com",
      "phone": "9123456789",
      "location" : "mankude"
    }
  ]
  services=servicesAPI;

  // whenever change happens update in db
  // event?.participants change this in reduxSlice
  // const localStorageInitialState = useSelector(state => state.participantsList.participantList)
  // const [participants, setParticipants] = useState(event?.participants||localStorageInitialState|| []);
  const [participants, setParticipants] = useState(event?.participants || []);
  const addParticipant = (participant) => {
    const updatedParticipants = [...participants, participant];
    setParticipants(updatedParticipants);

    // db call to store/local for now
    // add participant to db
    
    // // Store the update array in localStorage
    // localStorage.setItem('participants', JSON.stringify(updatedParticipants)); // Convert array to JSON string
    
  };

  const designInCanva = () => {
    if (canvaLink[event.eventType]) {
      window.open(canvaLink[event.eventType], '_blank');
    } else {
      console.log("Canva link for the selected event type does not exist.");
    }
  }
  
  
  const handleConfirm = () => {
    Swal.fire({
      title: 'Confirm Event Creation',
      text: "The service providers will receive your event details and you will receive information about them as well.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#03089a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call API to create event
        // Example: 
        // await apiCallToCreateEvent();
        // do api call to create event
    // popup indicating that the info about service provider will be sent to our email as well info about you will be sent to service provider
    // api call to send message
    // after api route to dashboard
    // after api-----------
    // send users email/id as well

        // Show success message
        Swal.fire(
          'Event Created!',
          'Your event has been successfully created and emails have been sent to both you and the service providers.',
          'success'
        )

        // Route to dashboard
        router.replace('/dashboard/event-creator');

        // Dispatch Redux actions to reset event details and to-do list
        dispatch(resetEventDetails());
        dispatch(resetTodo());
      }
    });
  }
  return (
      <Container className={'mb-5'}>
      <div className="flex flex-col px-3 md:px-8 w-full justify-center items-center gap-6">
      <div className="flex flex-col justify-center items-center md:gap-3">
      <h1 className="text-3xl lg:text-4xl font-semibold text-gray-950 text-center text-nowrap">{event.eventName}</h1>
      <h3 className="text-lg text-gray-600 md:text-xl">{event.eventType}</h3>
      </div>
      <div className="flex justify-between w-full mt-2 text-base md:text-xl">
        <p className="text-gray-700">{event.date}</p>
        <p className="text-gray-700">{event.location}</p>
      </div>
      
      <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold ">Services</h2>
    <ServicesList services={services}/>
    <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold mt-8">Invitees List</h2>
    <ParticipantList onAddParticipant={addParticipant}/>
    <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold mt-8">Todo List</h2>
    <TodoList/>
    
    {isCreating && (
      <>
     
        <Button className='flex items-center justify-center gap-2 mt-4 bg-zinc-800' onClick={designInCanva}><span><img src="/canva.png" alt="canva" className='w-6' /></span><p>Create Design</p></Button>
       <Button className='font-bold md:px-12 md:py-2' onClick={handleConfirm}>Confirm</Button>
      </>
      )}
    </div>
      </Container>
  )
}

export default DetailedEventDisplayer