"use client"
import { useState } from 'react'
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
  const [participants, setParticipants] = useState(event?.participants || []);
  const [todo, setTodo] = useState(event?.todo || []);
  const addParticipant = (participantName,phone) => {
    setParticipants([...participants, { name: participantName, phone }]);
  };

  const toggleTodoStatus = (index) => {
    const updatedTodo = todo.map((task, i) =>
      i === index ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } : task
    );
    setTodo(updatedTodo);
  };
  return (
      <Container className={'mb-5'}>
        <div className="flex flex-col px-3 md:px-8 border-b border-gray-300 w-full justify-center items-center gap-6">
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
    <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold mt-2">Attendance List</h2>
    <ParticipantList participants={participants} onAddParticipant={addParticipant}/>
    {isCreating && (
        <Button>Confirm</Button>
      )}
    </div>
      </Container>
  )
}

export default DetailedEventDisplayer