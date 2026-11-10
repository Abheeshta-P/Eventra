"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Container, Loading, EventsCard, DashboardLayout } from '@/components';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { MdEdit, MdSave } from 'react-icons/md';
import { eventCreatorService } from '@/utils';
import { setEvents } from '@/store/features/eventsSlice';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

function EventCreator() {
  const { events, loading } = useSelector(state => state.events);
  const { userData } = useSelector(state => state.auth);
  const [eventsPlanned, setEventsPlanned] = useState(events || []);
  const [isEditing, setIsEditing] = useState(false);
  const [changes, setChanges] = useState(false);
  const [deleteEventIds, setDeleteEventIds] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [mainTab, setMainTab] = useState('events');
  const [eventsSubTab, setEventsSubTab] = useState('active');
  const [actionLoadingKey, setActionLoadingKey] = useState(null);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];
  const activeEvents = eventsPlanned.filter(event => today <= event?.date);
  const completedEvents = eventsPlanned.filter(event => today > event?.date);

  const userNameFirstLetter = userData?.name?.charAt(0).toUpperCase() || 'E';

  const fetchPending = useCallback(async () => {
    try {
      const data = await eventCreatorService.getPendingRequests();
      if (Array.isArray(data)) {
        setPendingRequests(data);
      }
    } catch (e) {
      console.error("Error loading creator pending requests:", e);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleAcknowledgeSettlement = async (eventId, serviceId, serviceName) => {
    const result = await Swal.fire({
      title: 'Confirm Delivery & Payment?',
      text: `Confirm that ${serviceName} has completed their work and all offline payments (cash/UPI) have been settled?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#15803d',
      cancelButtonColor: '#52525b',
      confirmButtonText: 'Yes, Confirm & Settle',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const key = `${eventId}-${serviceId}`;
      setActionLoadingKey(key);
      try {
        const res = await eventCreatorService.updateServiceStatus(eventId, serviceId, 'completed');
        if (res) {
          Swal.fire({
            title: 'Settled',
            text: `${serviceName} service marked as completed and payment settled!`,
            icon: 'success',
            timer: 1800,
            showConfirmButton: false
          });
          setPendingRequests(prev => prev.filter(r => !(r.eventId === eventId && r.serviceId === serviceId)));
        } else {
          Swal.fire('Error', 'Failed to update service status.', 'error');
        }
      } catch (err) {
        console.error('Error settling service:', err);
        Swal.fire('Error', 'An unexpected error occurred.', 'error');
      } finally {
        setActionLoadingKey(null);
      }
    }
  };

  const editEvents = () => {
    if (isEditing && changes && deleteEventIds.length > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You will not be able to recover this event!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#991b1b',
        cancelButtonColor: '#52525b',
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
            console.error("editEvents error:", error);
            Swal.fire('Error', 'Event details deletion failed.', 'error');
            setError("Failed to delete event details. Please try again later.");
          }
        } else {
          router.refresh();
        }
      });
      setDeleteEventIds([]);
      setChanges(false);
    }
    setIsEditing(prev => !prev);
  };

  const onDeleteEvent = (eventId) => {
    setChanges(true);
    const updatedEvents = eventsPlanned?.filter(event => event._id !== eventId);
    setEventsPlanned(updatedEvents);
    setDeleteEventIds([...deleteEventIds, eventId]);
  };

  if (loading) return <Loading />;

  return (
    <DashboardLayout>
      <Container className="flex flex-col items-center md:items-start gap-4">
        {/* Main Profile Header - Identical Design as Service Provider Profile */}
        <div className="flex flex-col xl:flex-row items-center justify-between w-full bg-zinc-200 p-5 rounded-2xl mb-3 border border-zinc-300/80 shadow-xs gap-5">
          {/* Left: Avatar & Creator Details */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-4xl sm:text-6xl rounded-full w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-zinc-100 font-bold bg-[#03089a] shadow-sm shrink-0">
              {userNameFirstLetter}
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-zinc-950">
                  {userData?.name || 'Event Creator'}
                </h2>
                <span className="text-xs bg-[#03089a]/15 text-[#03089a] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Event Creator
                </span>
              </div>
              <p className="text-zinc-600 text-sm font-medium">
                {userData?.email}
              </p>
              <div className="mt-2">
                <Link href={'/dashboard/event-creator/event-types'}>
                  <Button className="font-semibold text-xs py-1.5 px-4 shadow-xs">Plan New Event</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Key Performance Indicators (Identical to Service Provider) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto shrink-0">
            <div
              onClick={() => setMainTab('events')}
              className="bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-center shadow-xs cursor-pointer hover:border-zinc-400 transition"
            >
              <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wide">
                Total Events
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
                {eventsPlanned.length}
              </p>
            </div>
            <div
              onClick={() => setMainTab('confirm-services')}
              className="bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-center shadow-xs cursor-pointer hover:border-zinc-400 transition"
            >
              <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                Pending Action
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-0.5">
                {pendingRequests.length}
              </p>
            </div>
            <div
              onClick={() => {
                setMainTab('events');
                setEventsSubTab('active');
              }}
              className="bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-center shadow-xs cursor-pointer hover:border-zinc-400 transition"
            >
              <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                Active Events
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-0.5">
                {activeEvents.length}
              </p>
            </div>
            <div
              onClick={() => {
                setMainTab('events');
                setEventsSubTab('completed');
              }}
              className="bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-center shadow-xs cursor-pointer hover:border-zinc-400 transition"
            >
              <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide">
                Done Events
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#03089a] mt-0.5">
                {completedEvents.length}
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation Header - Replicates HeaderServiceProviderDashboard Design */}
        <header className="flex items-center justify-around text-zinc-800 p-1.5 rounded-xl shadow-xs border border-zinc-300 font-semibold bg-zinc-100 mb-3 w-full">
          <button
            type="button"
            onClick={() => setMainTab('events')}
            className={`transition-colors duration-200 ease-in-out px-4 py-2 rounded-lg flex items-center justify-center gap-2 flex-1 ${
              mainTab === 'events'
                ? 'text-[#03089a] bg-zinc-200/80 font-bold shadow-xs'
                : 'hover:text-zinc-950 text-zinc-600'
            }`}
          >
            <span>Events</span>
          </button>
          <button
            type="button"
            onClick={() => setMainTab('confirm-services')}
            className={`transition-colors duration-200 ease-in-out px-4 py-2 rounded-lg flex items-center justify-center gap-2 flex-1 ${
              mainTab === 'confirm-services'
                ? 'text-[#03089a] bg-zinc-200/80 font-bold shadow-xs'
                : 'hover:text-zinc-950 text-zinc-600'
            }`}
          >
            <span>Confirm Services</span>
          </button>
        </header>

        {/* Content Container - Matching Service Provider login-bg Box */}
        <div className="relative transition-all bg-zinc-200 p-4 pt-4 pb-6 rounded-2xl border border-zinc-300/80 login-bg w-full">
          {mainTab === 'events' && (
            <div className="w-full flex flex-col gap-3 -mt-4 min-h-[380px]">
              {/* Sub-Tabs: Active and Completed (Replicating SP bookings tabs) */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center p-1 py-3 rounded-xl border border-zinc-300 shadow-none">
                  {[
                    { key: 'active', label: 'Active', count: activeEvents.length },
                    { key: 'completed', label: 'Completed', count: completedEvents.length }
                  ].map((tab) => {
                    const isActive = eventsSubTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setEventsSubTab(tab.key)}
                        className={`capitalize px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#03089a] text-zinc-100 shadow-xs'
                            : 'text-zinc-700 hover:bg-zinc-200/90 hover:text-zinc-950'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                          <span
                            className={`text-[10px]  font-bold ${
                              isActive
                                ? ' text-zinc-100'
                                : ' text-zinc-800'
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Manage Events button - Available across both active and completed events */}
                {eventsPlanned.length > 0 && (
                  <button
                    onClick={editEvents}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-200 hover:bg-zinc-300 text-zinc-800 border border-zinc-300 transition"
                  >
                    {isEditing ? <MdSave size={16} /> : <MdEdit size={16} />}
                    <span>{isEditing ? 'Save Changes' : 'Manage Events'}</span>
                  </button>
                )}
              </div>

              {/* Sub-tab 1: Active Events */}
              {eventsSubTab === 'active' && (
                <div className="w-full">
                  {activeEvents.length === 0 ? (
                    <div className="bg-zinc-100/90 rounded-xl p-8 text-center border border-dashed border-zinc-300 min-h-[300px] flex flex-col items-center justify-center">
                      <h3 className="text-sm font-semibold text-zinc-800">No active events planned</h3>
                      <p className="text-xs text-zinc-500 mt-1 mb-4">Plan your first event and book providers.</p>
                      <Link href="/dashboard/event-creator/event-types">
                        <Button className="font-semibold text-xs py-2 px-4">Plan Event</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 justify-items-center w-full min-h-[300px] content-start">
                      {activeEvents.map((event) => (
                        <EventsCard
                          key={event._id}
                          eventId={event._id}
                          eventName={event.eventName}
                          eventType={event.eventType}
                          location={event.location}
                          date={event.date}
                          isEditing={isEditing}
                          onDeleteEvent={onDeleteEvent}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Completed Events */}
              {eventsSubTab === 'completed' && (
                <div className="w-full">
                  {completedEvents.length === 0 ? (
                    <div className="bg-zinc-100/90 rounded-xl p-8 text-center border border-dashed border-zinc-300 min-h-[300px] flex flex-col items-center justify-center">
                      <h3 className="text-sm font-semibold text-zinc-800">No completed events yet</h3>
                      <p className="text-xs text-zinc-500 mt-1">Events whose date has passed will appear here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 justify-items-center w-full min-h-[300px] content-start">
                      {completedEvents.map((event) => (
                        <EventsCard
                          key={event._id}
                          eventId={event._id}
                          eventName={event.eventName}
                          eventType={event.eventType}
                          location={event.location}
                          date={event.date}
                          isEditing={isEditing}
                          onDeleteEvent={onDeleteEvent}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MAIN TAB 2: CONFIRM SERVICES (DELIVERY & PAYMENT CONFIRMATIONS) */}
          {mainTab === 'confirm-services' && (
            <div className="w-full flex flex-col gap-3 min-h-[380px]">
              {pendingRequests.length === 0 ? (
                <div className="bg-zinc-100/90 rounded-xl p-8 text-center border border-dashed border-zinc-300 min-h-[300px] flex flex-col items-center justify-center">
                  <h3 className="text-sm font-semibold text-zinc-800">All caught up!</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    No pending delivery or offline payment settlement requests from service providers.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-h-[300px] content-start">
                  {pendingRequests.map((req) => {
                    const isBusy = actionLoadingKey === `${req.eventId}-${req.serviceId}`;
                    return (
                      <div
                        key={`${req.eventId}-${req.serviceId}`}
                        className="bg-zinc-100 rounded-xl p-3.5 shadow-xs hover:border-zinc-400 transition-all border border-zinc-300 flex flex-col justify-between gap-2.5"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block">
                                {req.eventName} • {req.eventType}
                              </span>
                              <h3 className="text-sm font-bold text-zinc-950 truncate" title={req.serviceName}>
                                {req.serviceName}
                              </h3>
                              <p className="text-xs text-zinc-600 truncate mt-0.5">
                                Category: <strong className="text-zinc-800">{req.serviceCategory}</strong>
                              </p>
                            </div>
                            <div className="text-right shrink-0 bg-zinc-200/80 border border-zinc-300/80 px-2 py-0.5 rounded-lg">
                              <span className="text-[9px] text-zinc-500 font-semibold block uppercase tracking-wide">
                                Agreed Fee
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold text-green-800">
                                ₹{req.cost}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-zinc-200/90 flex flex-col gap-1 text-[11px]">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="truncate">
                                <span className="text-[9px] uppercase font-bold text-zinc-400 block">Location</span>
                                <span className="text-zinc-800 font-medium truncate block">{req.location}</span>
                              </div>
                              <div className="truncate">
                                <span className="text-[9px] uppercase font-bold text-zinc-400 block">Event Date</span>
                                <span className="text-zinc-800 font-medium truncate block">
                                  {new Date(req.eventDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-200/90 flex items-center gap-2">
                          <button
                            disabled={isBusy}
                            onClick={() => handleAcknowledgeSettlement(req.eventId, req.serviceId, req.serviceName)}
                            className="flex-1 bg-green-700 hover:bg-green-800 text-zinc-100 font-semibold py-1.5 px-3 rounded-lg text-xs transition shadow-xs disabled:opacity-60"
                          >
                            {isBusy ? 'Settling...' : 'Confirm & Settle'}
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/event-creator/event/${req.eventId}`)}
                            className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-medium py-1.5 px-2.5 rounded-lg text-xs transition border border-zinc-300 shrink-0"
                          >
                            View Event
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </DashboardLayout>
  );
}

export default EventCreator;
