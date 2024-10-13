"use client"
import React from 'react'
import { Button, Container,ProfileSection,EventsCard } from '..'
import Link from 'next/link'
import { useSelector } from 'react-redux'



function CreatorDashboard() {
  const {userData} = useSelector(state => state.auth);

  const EventsDisplay = () =>{
    if(userData?.events?.length == 0){
      return <div className='text-zinc-700 font-semibold text-lg md:text-xl lg:text-2xl text-center w-full'>No events yet</div>
    }
    else {
      return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full transition-all" >
        {
           userData?.events?.map(event => (
            <EventsCard eventName={event.eventName} eventType={event.eventType} location={event.location} date={event.date} key={event.eventName + event.date}/>
          ))
        }
      </div>
      )
    }
  }

  return (
    <Container className={'flex flex-col items-center md:items-start'}>
      {/* profile info */}
      <ProfileSection>
      <Link href = {'/dashboard/event-creator/create-event'}> <Button className='font-semibold mt-3'>Create Event</Button></Link>
      </ProfileSection>
      {/* event */}
        <EventsDisplay/>
     
    </Container>
  )
}

export default CreatorDashboard