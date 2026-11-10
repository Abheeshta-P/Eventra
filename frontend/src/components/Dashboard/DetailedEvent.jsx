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
import { HiBell } from 'react-icons/hi';

function DetailedEventDisplayer({ event, isCreating = false, servicesAPI, isDisabled = false }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [hasChanges, setHasChanges] = useState(false);
  const [servicesList, setServicesList] = useState(servicesAPI || []);
  const participants = useSelector(state => state.participantsList.participantList);
  const todos = useSelector((state) => state.todoList.todos);
  const { userData } = useSelector((state) => state.auth);
  const [sending, setSending] = useState(false);

  React.useEffect(() => {
    setServicesList(servicesAPI || []);
  }, [servicesAPI]);

  const pendingConfirmations = servicesList.filter(s => s.status === 'completion_requested');

  const handleUpdateServiceStatus = async (serviceId, serviceName, newStatus) => {
    const isConfirming = newStatus === 'completed';
    const result = await Swal.fire({
      title: isConfirming ? 'Acknowledge Service & Payment?' : 'Mark Service as In-Progress?',
      text: isConfirming 
        ? `Are you sure ${serviceName} has completed their work and all offline payments (cash/UPI) have been settled?` 
        : `Revert ${serviceName}'s status back to confirmed?`,
      icon: isConfirming ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isConfirming ? '#16a34a' : '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: isConfirming ? 'Yes, Confirm & Settle' : 'Yes, Revert',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const res = await eventCreatorService.updateServiceStatus(event._id, serviceId, newStatus);
        if (res) {
          Swal.fire({
            title: 'Updated!',
            text: isConfirming ? 'Service marked as completed and payment settled!' : 'Status updated.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          setServicesList(prev => prev.map(s => s._id === serviceId ? { ...s, status: newStatus } : s));
        } else {
          Swal.fire('Error', 'Failed to update service status.', 'error');
        }
      } catch (err) {
        console.error('Error updating service status by creator:', err);
        Swal.fire('Error', 'An unexpected error occurred.', 'error');
      }
    }
  };



  const designInCanva = () => {
    if (canvaLink[event.eventType]) {
      window.open(canvaLink[event.eventType], '_blank');
    } else {
      Swal.fire('Error', 'Canva link for this event type does not exist.', 'error');
    }
  };

  const handleConfirm = async () => {
    Swal.fire({
      title: 'Submit Event Creation',
      text: "Service providers will be notified and you'll receive their details.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#03089a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit',
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

        {/* Vendor Delivery & Payment Acknowledgment Banner for Creator */}
        {!isCreating && pendingConfirmations.length > 0 && (
          <div className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <HiBell className="text-amber-800 shrink-0" size={20} />
              <span>Vendor Delivery & Offline Payment Acknowledgment</span>
            </div>
            <p className="text-xs text-amber-800">
              The following service provider(s) have marked their services as delivered. Please confirm that you have received their service and settled any offline payments (cash/UPI):
            </p>
            <div className="space-y-2 mt-2">
              {pendingConfirmations.map((service) => (
                <div key={service._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-100/60 p-3.5 rounded-xl border border-amber-300">
                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      {service.name} <span className="text-xs font-normal text-zinc-500">({service.category})</span>
                    </p>
                    <p className="text-xs text-green-700 font-semibold">Agreed Fee: ₹{service.cost}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateServiceStatus(service._id, service.name, 'completed')}
                      className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      Confirm Delivery & Settle
                    </button>
                    <button
                      onClick={() => handleUpdateServiceStatus(service._id, service.name, 'confirmed')}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-medium transition"
                    >
                      Not Yet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 text-2xl lg:text-3xl font-semibold">Services</h2>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
              {servicesList.length} Selected
            </span>
          </div>
          <ServicesList 
            services={servicesList} 
            onCreatorAction={!isCreating ? handleUpdateServiceStatus : undefined} 
          />
        </div>


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
            <Button 
              className="font-bold md:px-12 md:py-2 disabled:opacity-60" 
              onClick={handleConfirm}
              disabled={sending}
            >
              {sending ? 'Creating Event...' : 'Submit'}
            </Button>
          </>
        ) : (
          hasChanges && (
            <Button 
              className="font-bold md:px-12 md:py-2 disabled:opacity-60" 
              onClick={handleSave}
              disabled={sending}
            >
              {sending ? 'Saving...' : 'Save'}
            </Button>
          )
        )}
      </div>
    </Container>
  );
}

export default DetailedEventDisplayer;
