"use client"
import React, { useState } from 'react'
import { Button, Container,ProfileSection,EventsCard,Loading, DashboardLayout } from '@/components'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { MdEdit,MdSave } from 'react-icons/md'
import { eventCreatorService } from '@/utils'
import { setEvents } from '@/store/features/eventsSlice'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

function EventCreator() {
  const { events, loading } = useSelector(state => state.events);
  const [ eventsPlanned, setEventsPlanned] = useState(events || []);
  const [isEditing,setIsEditing] = useState(false);
  const [changes,setChanges] = useState(false);
  const [deleteEventIds,setDeleteEventIds] = useState([]);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showCompleted, setShowCompleted] = useState(false);

const toggleView = () => {
  setShowCompleted((prev) => !prev);
};

const today = new Date().toISOString().split('T')[0];
const filteredEvents = eventsPlanned.filter((event) => {
 return showCompleted ? (today > event?.date) : (today<=event?.date)
}
);

const completedEvents = eventsPlanned.filter(event => (today > event?.date));

  const editEvents = () => {
    if (isEditing && changes && deleteEventIds.length>0) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You will not be able to recover this event!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await eventCreatorService.deleteEvents(JSON.stringify(deleteEventIds));
            
            if (response.status === 403 || response.status === 401) {
              router.push('/login');
              return;
            }
    
            if (response) {
              setEventsPlanned(response.remainingEvents);
              dispatch(setEvents(response.remainingEvents));
              Swal.fire('Deleted!', 'Event details deleted successfully!', 'success');
            } else {
              setError("Event details are not deleted.");
            }
          } catch (error) {
            console.error("editEvents :: delete details of events :: frontend :: error", error);
            Swal.fire('Error', 'Event details deletion failed.', 'error');
            setError("Failed to delete event details. Please try again later.");
          }
        } else {
          Swal.fire('Cancelled', 'Your event is safe :)', 'info');
          router.refresh();
        }
      });
      setDeleteEventIds([]);
      setChanges(false);
    }
    setIsEditing(prev => !prev);
  }

  const onDeleteEvent = (eventId) => {
    // delete event from the state events
    setChanges(true);
    const updatedEvents = eventsPlanned?.filter(event => event._id!==eventId);
    setEventsPlanned(updatedEvents);
    setDeleteEventIds([...deleteEventIds, eventId]);
  }

  const EventsDisplay = () => {
    if (loading) {
      return <Loading/>; 
    }

    if (error) {
      return (
        <>
          <div className="flex justify-center items-center h-full">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </>
      );
    }

    if (eventsPlanned?.length === 0 &&!changes) {
      return <div className="text-zinc-700 font-semibold text-lg md:text-xl lg:text-2xl text-center w-full">No events yet</div>;
    } else {
      return (
        <div className='relative transition-all w-full p-4 py-12 bg-zinc-300 login-bg min-h-80'>
          <div className='absolute w-7 h-7 bg-zinc-600 text-white flex justify-center items-center rounded-full top-2 right-1'>
          <button onClick={editEvents}> {isEditing?<MdSave className='w-4 h-4'/>:<MdEdit className='w-4 h-4'/>}</button>
        </div>
        <div className="flex justify-between items-center w-full flex-col gap-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full transition-all">
          {filteredEvents?.map(event => (
            <EventsCard eventId={event._id} eventName={event.eventName} eventType={event.eventType} location={event.location} date={event.date} key={event._id} isEditing={isEditing} onDeleteEvent={onDeleteEvent}/>
          ))}
        </div>

        {completedEvents.length > 0 && (
        <button 
          onClick={toggleView} 
          className="bg-[#03089a] text-white px-4 py-2 rounded mb-4"
        >
          {showCompleted ? "View Planned Events" : "View Completed Events"}
        </button>
      )}
      </div>

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
