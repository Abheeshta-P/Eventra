"use client"
import { useState } from 'react'
import Link from 'next/link'
import React from 'react'
import { Container,ParticipantList,ServicesList,Button } from '..'


function DetailedEventDisplayer({ event, isCreating = false, eventName, eventType, date, location }) {
  // api call,
  const services =  [
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
      "email": "contact@capturingmoments.com",
      "phone": "9123456789",
      "location" : "mankude"
    }
    ,
    {
      "category": "Photography",
      "name": "Capturing Moments",
      "cost": 20000,
      "email": "contact@capturingmoments.com",
      "phone": "9123456789",
      "location" : "mankude"
    }
  ]
  // canva link constants
  const canvaLink = {
    wedding : 'https://www.canva.com/search?q=wedding',
    party : 'https://www.canva.com/search?q=party%20posters',
    entertainment : 'https://www.canva.com/search?q=entertainment%20posters'
  }

  // whenever change happens update in db
  // event?.participants change this in reduxSlice
  const [participants, setParticipants] = useState(event?.participants || []);
  const [todo, setTodo] = useState(event?.todo || []);
  const addParticipant = (participant) => {
    // Create a new array with the added participant
    const updatedParticipants = [...participants, participant];
  
    // Update the state with the new array
    setParticipants(updatedParticipants);

    // db call to store/local for now
    // add participant to db
    
    // Store the updated array in localStorage
    localStorage.setItem('participants', JSON.stringify(updatedParticipants)); // Convert array to JSON string
  
    // Optional: Log the participants from localStorage
    const participantsFromLocalStorage = JSON.parse(localStorage.getItem('participants'));
    console.log(participantsFromLocalStorage);
  };
  

  const toggleTodoStatus = (index) => {
    const updatedTodo = todo.map((task, i) =>
      i === index ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } : task
    );
    setTodo(updatedTodo);
  };
  return (
      <Container className={'mb-5'}>
        <div className="flex flex-col px-3 md:px-8 w-full justify-center items-center gap-6">
      <div className="flex flex-col justify-center items-center md:gap-3">
      <h1 className="text-3xl lg:text-4xl font-semibold text-gray-950 text-center text-nowrap">{eventName}</h1>
      <h3 className="text-lg text-gray-600 md:text-xl">{eventType}</h3>
      </div>
      <div className="flex justify-between w-full mt-2 text-base md:text-xl">
        <p className="text-gray-700">{date}</p>
        <p className="text-gray-700">{location}</p>
      </div>
      
      <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold ">Services</h2>
    <ServicesList services={services}/>
    <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold mt-8">Invitees List</h2>
    <ParticipantList onAddParticipant={addParticipant}/>
    
    {isCreating && (
      <>
        <Link href={canvaLink[eventType]} target='_blank'>
        <Button className='flex items-center justify-center gap-2 mt-4 bg-zinc-800'><span><img src="../../../canva.png" alt="canva" className='w-6' /></span><p>Create Design</p></Button>
        </Link>
       <Button className='bg-[#009c12] font-semibold px-5'>Confirm</Button>
      </>
      )}
    </div>
      </Container>
  )
}

export default DetailedEventDisplayer