"use client";
import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import React from 'react';
import { Container, ParticipantList, Button, TodoList, Loading } from '..';
import { useDispatch, useSelector } from 'react-redux';
import { resetEventDetails } from '@/store/features/eventDetailsSlice';
import { resetTodo } from '@/store/features/todoSlice';
import { canvaLink } from '@/constants';
import { useRouter } from 'next/navigation';
import { eventCreatorService } from '@/utils';
import { setEvents } from '@/store/features/eventsSlice';
import { resetParticipants } from '@/store/features/participantSlice';
import { HiChevronLeft, HiChevronRight, HiExternalLink, HiCalendar, HiLocationMarker } from 'react-icons/hi';

function DetailedEventDisplayer({ event, isCreating = false, servicesAPI, isDisabled = false }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [hasChanges, setHasChanges] = useState(false);
  const [servicesList, setServicesList] = useState(servicesAPI || []);
  const participants = useSelector(state => state.participantsList.participantList);
  const todos = useSelector((state) => state.todoList.todos);
  const { userData } = useSelector((state) => state.auth);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const isCompleted = isDisabled || Boolean(event?.completed) || Boolean(event?.date && today > event.date);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const rsvpUrl = event?._id ? `${origin}/rsvp/${event._id}` : '';

  // Calculate RSVP metrics
  const totalOnList = participants?.length || 0;
  const sentInvitesCount = (participants || []).filter(p => p.inviteSent).length;
  const attendingGuests = (participants || []).filter(p => p.rsvpStatus === 'attending' || p.completed);
  const totalHeadcount = attendingGuests.reduce((acc, p) => acc + (p.headcount || 1), 0);
  const declinedCount = (participants || []).filter(p => p.rsvpStatus === 'declined').length;
  const pendingCount = (participants || []).filter(p => !p.rsvpStatus || p.rsvpStatus === 'pending').length;

  const handleCopyLink = () => {
    if (!rsvpUrl) return;
    navigator.clipboard.writeText(rsvpUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleWhatsAppShare = () => {
    if (!rsvpUrl) return;
    const msg = `You are invited to ${event.eventName}! Please view event details and RSVP here: ${rsvpUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const servicesScrollRef = useRef(null);

  const handleScrollServicesLeft = () => {
    servicesScrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
  };

  const handleScrollServicesRight = () => {
    servicesScrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' });
  };

  const handleServicesWheel = (e) => {
    if (servicesScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      servicesScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleServiceClick = (service) => {
    const eventTypeParam = event?.eventType || 'general';
    const categoryParam = service?.category || 'all';
    const serviceIdentifier = service._id || encodeURIComponent(service.email);
    router.push(`/dashboard/event-creator/event-types/${eventTypeParam}/categories/${categoryParam}/services/${serviceIdentifier}`);
  };

  React.useEffect(() => {
    setServicesList(servicesAPI || []);
  }, [servicesAPI]);

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
        {/* Unified Event Header Card */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between w-full bg-zinc-200 p-5 rounded-2xl border border-zinc-300/80 shadow-xs gap-5">
          {/* Left: Event Details (Minimal & Compact) */}
          <div className="flex flex-col justify-between w-full lg:w-[32%] shrink-0 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
                  {event.eventType}
                </p>
                {isCompleted && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-300 text-zinc-800 border border-zinc-400 px-2 py-0.2 rounded-full cursor-default">
                    Completed (Read-Only)
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-snug break-words [overflow-wrap:anywhere]">
                {event.eventName}
              </h1>
              <div className="flex flex-col gap-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-300/60 mt-1">
                <div className="flex items-center gap-1.5 text-zinc-900">
                  <HiCalendar size={14} className="text-[#03089a] shrink-0" />
                  <span className="font-semibold">{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-600 min-w-0">
                  <HiLocationMarker size={14} className="text-[#03089a] shrink-0" />
                  <span className="truncate block" title={event.location}>{event.location}</span>
                </div>
              </div>
            </div>
            {/* RSVP Attendance Metric Badges - Minimal, subtle */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-zinc-200">
              <div className="bg-zinc-100/90 border border-zinc-300 rounded-lg p-2 text-center">
                <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wide block">
                  Guest List
                </span>
                <span className="text-sm font-bold text-zinc-900 block">
                  {totalOnList}
                </span>
                {sentInvitesCount > 0 ? (
                  <span className="text-[9px] text-emerald-700 font-semibold block">
                    {sentInvitesCount} invited
                  </span>
                ) : (
                  <span className="text-[9px] text-zinc-400 block">
                    0 invited
                  </span>
                )}
              </div>
              <div className="bg-zinc-100/90 border border-zinc-300 rounded-lg p-2 text-center">
                <span className="text-[9px] font-semibold text-emerald-800 uppercase tracking-wide block">
                  Attending
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  {totalHeadcount} ({attendingGuests.length})
                </span>
              </div>
              <div className="bg-zinc-100/90 border border-zinc-300 rounded-lg p-2 text-center">
                <span className="text-[9px] font-semibold text-red-800 uppercase tracking-wide block">
                  Declined
                </span>
                <span className="text-sm font-bold text-red-700">
                  {declinedCount}
                </span>
              </div>
              <div className="bg-zinc-100/90 border border-zinc-300 rounded-lg p-2 text-center">
                <span className="text-[9px] font-semibold text-amber-800 uppercase tracking-wide block">
                  Pending
                </span>
                <span className="text-sm font-bold text-amber-700">
                  {pendingCount}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Booked Services Compact Horizontal Scroller */}
          <div className="flex-1 w-full bg-zinc-100 border border-zinc-300 rounded-xl p-3.5 shadow-none flex flex-col justify-between gap-2 overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  Booked Services
                </h2>
                <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-200 px-1 py-0.5 rounded-full border border-zinc-300">
                  {servicesList.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {servicesList.length > 0 && (
                  <span className="text-xs font-bold text-emerald-800">
                    Total: ₹{servicesList.reduce((acc, s) => acc + (Number(s.cost) || 0), 0)}
                  </span>
                )}
                {servicesList.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleScrollServicesLeft}
                      className="p-1 rounded-md bg-zinc-200 hover:bg-zinc-300 text-zinc-700 transition"
                      title="Scroll Left"
                    >
                      <HiChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={handleScrollServicesRight}
                      className="p-1 rounded-md bg-zinc-200 hover:bg-zinc-300 text-zinc-700 transition"
                      title="Scroll Right"
                    >
                      <HiChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {servicesList.length > 0 ? (
              <div 
                ref={servicesScrollRef}
                onWheel={handleServicesWheel}
                className="flex items-stretch gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin select-none"
              >
                {servicesList.map((service, idx) => {
                  const statusConfig = service?.status ? {
                    pending: { bg: 'bg-zinc-200', text: 'text-zinc-700', border: 'border-zinc-300', label: 'Requested' },
                    confirmed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Booked' },
                    completion_requested: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', label: 'Unsettled' },
                    declined: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Declined' },
                    completed: { bg: 'bg-zinc-200', text: 'text-zinc-700', border: 'border-zinc-300', label: 'Settled' }
                  }[service.status] : null;

                  return (
                    <div
                      key={service._id || service.email || idx}
                      onClick={() => handleServiceClick(service)}
                      role="button"
                      tabIndex={0}
                      title={`Click to view full details for ${service.name}`}
                      className="min-w-[180px] max-w-[220px] bg-zinc-50 hover:bg-white border border-zinc-300 hover:border-[#03089a] rounded-lg p-2.5 flex flex-col justify-between gap-1.5 shrink-0 transition-all cursor-pointer shadow-2xs group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 truncate">
                            {service.category || 'Service'}
                          </span>
                          {statusConfig && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} shrink-0`}>
                              {statusConfig.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-xs text-zinc-900 group-hover:text-[#03089a] truncate transition-colors">
                            {service.name}
                          </h3>
                          <HiExternalLink size={12} className="text-zinc-400 group-hover:text-[#03089a] shrink-0 transition-colors" />
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-zinc-200/80 flex items-center justify-between gap-1 text-[11px]">
                        <span className="font-bold text-emerald-800">₹{service.cost}</span>
                        {service.phone && (
                          <span className="text-[10px] text-zinc-500 truncate font-mono">
                            {service.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-5 text-xs text-zinc-500">
                No services selected for this event yet.
              </div>
            )}
          </div>
        </div>

        {/* Guest Invites & RSVPs Section */}
        <div className="w-full flex flex-col items-center">
          {/* Guest Invitation Link Card (Moved down) */}
          <div className="w-full max-w-3xl bg-zinc-100 border border-zinc-300 rounded-xl p-3.5 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                Guest Invitation Link
              </h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Share this link with invitees to collect real-time attendance, headcounts & dietary preferences.
              </p>
            </div>

            {/* Actions - Text only, clean & minimal */}
            {!isCreating && event?._id ? (
              <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
                {isCompleted ? (
                  <span className="text-xs font-semibold text-zinc-500 bg-zinc-200 border border-zinc-300 px-3 py-1.5 rounded-lg cursor-not-allowed select-none">
                    RSVP Closed
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 sm:flex-none text-center bg-[#03089a] hover:bg-[#020677] text-zinc-100 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      {copied ? "Copied" : "Copy Link"}
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsAppShare}
                      className="flex-1 sm:flex-none text-center bg-green-700 hover:bg-green-800 text-zinc-100 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      WhatsApp
                    </button>
                  </>
                )}
                <a
                  href={`/rsvp/${event._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-center text-xs text-zinc-700 hover:text-zinc-950 font-semibold px-2.5 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-200/80 transition shrink-0 cursor-pointer"
                >
                  Preview
                </a>
              </div>
            ) : (
              <span className="text-xs text-zinc-500 italic">
                Link generated after event creation
              </span>
            )}
          </div>

          <ParticipantList
            eventId={isCreating ? null : event?._id}
            isCreating={isCreating}
            setHasChanges={setHasChanges}
            isDisabled={isCompleted}
          />
        </div>

        {/* Checklist & Todo List Section */}
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center justify-between w-full max-w-3xl mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Checklist & Tasks
            </h2>
            <span className="text-xs font-semibold text-zinc-600 bg-zinc-200 px-2.5 py-1 rounded-full border border-zinc-300">
              {todos?.length || 0} Items
            </span>
          </div>
          <TodoList setHasChanges={setHasChanges} isDisabled={isCompleted} />
        </div>

        {isCreating ? (
          <>
            <Button
              className="flex items-center justify-center gap-2 mt-4 bg-zinc-800"
              onClick={designInCanva}
            >
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
              {sending ? "Creating Event..." : "Submit"}
            </Button>
          </>
        ) : (
          hasChanges && !isCompleted && (
            <Button
              className="font-bold md:px-12 md:py-2 disabled:opacity-60"
              onClick={handleSave}
              disabled={sending}
            >
              {sending ? "Saving..." : "Save"}
            </Button>
          )
        )}
      </div>
    </Container>
  );
}

export default DetailedEventDisplayer;
