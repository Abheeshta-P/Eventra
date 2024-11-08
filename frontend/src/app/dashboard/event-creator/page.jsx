"use client"
import React from 'react'
import { Button, Container,ProfileSection,EventsCard,Loading, DashboardLayout } from '@/components'
import Link from 'next/link'
import { useSelector } from 'react-redux'

function EventCreator() {
  const { events, loading } = useSelector(state => state.events);

  const EventsDisplay = () => {
    if (loading) {
      return <Loading/>; 
    }

    if (events?.length === 0) {
      return <div className="text-zinc-700 font-semibold text-lg md:text-xl lg:text-2xl text-center w-full">No events yet</div>;
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full transition-all">
          {events?.map(event => (
            <EventsCard eventId={event.id} eventName={event.eventName} eventType={event.eventType} location={event.location} date={event.date} key={event.eventName + event.date} />
          ))}
        </div>
      );
    }
  };
  if (loading) {
    return <Loading/>; 
  }
  return (
   <DashboardLayout>
     <Container className={'flex flex-col items-center md:items-start'}>
      <ProfileSection>
        <Link href={'/dashboard/event-creator/event-types'}>
          <Button className="font-semibold mt-3">Plan Event</Button>
        </Link>
      </ProfileSection>
      <EventsDisplay />
    </Container>
   </DashboardLayout>
  );
}

export default EventCreator;
