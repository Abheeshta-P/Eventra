"use client";
import React, { useState, useEffect, useCallback } from 'react';
import serviceProviderService from '@/utils/serviceProvider';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Loading } from '@/components';

function ServiceProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actionLoadingKey, setActionLoadingKey] = useState(null);
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceProviderService.getBookings();
      if (data && Array.isArray(data)) {
        setBookings(data);
        // If no pending bookings but there are confirmed ones, default to confirmed
        const hasPending = data.some(b => b.status === 'pending');
        if (!hasPending && data.some(b => b.status === 'confirmed')) {
          setFilter('confirmed');
        }
      } else if (data?.status === 401 || data?.status === 403) {
        router.push('/login');
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (eventId, serviceId, newStatus) => {
    const today = new Date().toISOString().split('T')[0];
    const targetBooking = bookings.find(b => b.eventId === eventId && b.bookingId === serviceId);
    if (newStatus === 'confirmed' && targetBooking && today > targetBooking.date) {
      Swal.fire({
        title: 'Event Date Passed',
        text: 'This event date has already passed. New booking confirmations cannot be accepted for past events.',
        icon: 'warning'
      });
      return;
    }

    const actionLabel = 
      newStatus === 'confirmed' ? 'Accept this booking' :
      newStatus === 'declined' ? 'Decline this booking' :
      newStatus === 'pending' ? 'Revert this booking back to pending' :
      'Mark this service as Delivered';

    const actionText = 
      newStatus === 'completion_requested'
        ? 'The client will receive an acknowledgment prompt on their dashboard to confirm service delivery and verify offline payment settlement.'
        : newStatus === 'pending'
        ? 'This booking will be returned to your pending requests queue.'
        : 'The client will be notified of your update.';

    const confirmButtonText = 
      newStatus === 'completion_requested' ? 'Yes, Request Settlement' :
      newStatus === 'confirmed' ? 'Yes, Accept' :
      newStatus === 'declined' ? 'Yes, Decline' :
      'Yes, Revert to Pending';

    const result = await Swal.fire({
      title: `${actionLabel}?`,
      text: actionText,
      icon: newStatus === 'declined' ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'declined' ? '#991b1b' : '#03089a',
      cancelButtonColor: '#52525b',
      confirmButtonText,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const actionKey = `${eventId}-${serviceId}-${newStatus}`;
      setActionLoadingKey(actionKey);
      try {
        const res = await serviceProviderService.updateBookingStatus(eventId, serviceId, newStatus);
        if (res) {
          Swal.fire({
            title: 'Updated',
            text: `Booking marked as ${newStatus.replace('_', ' ')}.`,
            icon: 'success',
            timer: 1600,
            showConfirmButton: false
          });
          // Update in local state
          setBookings(prev => 
            prev.map(b => (b.eventId === eventId && b.bookingId === serviceId) ? { ...b, status: newStatus } : b)
          );
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('booking-updated'));
          }
        } else {
          Swal.fire('Error', 'Failed to update booking status. Please try again.', 'error');
        }
      } catch (err) {
        console.error("Status update error:", err);
        Swal.fire('Error', 'An unexpected error occurred.', 'error');
      } finally {
        setActionLoadingKey(null);
      }
    }
  };

  // Filter bookings: In confirmed tab, also display completion_requested so provider can track delivery
  const filteredBookings = bookings.filter(b => {
    if (filter === 'confirmed') {
      return b.status === 'confirmed' || b.status === 'completion_requested';
    }
    return b.status === filter;
  });

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'completion_requested').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const declinedCount = bookings.filter(b => b.status === 'declined').length;

  const tabCounts = {
    pending: pendingCount,
    confirmed: confirmedCount,
    completed: completedCount,
    declined: declinedCount
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-3 -mt-4 min-h-[380px]">
      {/* Small Compact Tab Bar - No pure white anywhere */}
      <div className="flex items-center">
        <div className="inline-flex items-center p-1 py-3 rounded-xl border border-zinc-300 shadow-none">
          {['pending', 'confirmed', 'completed', 'declined'].map((tab) => {
            const count = tabCounts[tab] || 0;
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`capitalize px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-[#03089a] text-zinc-100 shadow-xs' 
                    : 'text-zinc-700 hover:bg-zinc-200/90 hover:text-zinc-950'
                }`}
              >
                <span>{tab}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold ${
                      isActive 
                        ? ' text-zinc-100' 
                        : tab === 'pending'
                        ? ' text-amber-900'
                        : ' text-zinc-800'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings Grid with Minimum Height to avoid layout jumps */}
      {filteredBookings.length === 0 ? (
        <div className="bg-zinc-100/90 rounded-xl p-8 text-center border border-dashed border-zinc-300 min-h-[300px] flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-zinc-800">No {filter} bookings</h3>
          <p className="text-xs text-zinc-500 mt-1">
            {filter === 'pending' 
              ? 'You have answered all incoming event inquiries.' 
              : `No bookings found under ${filter}.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-h-[300px] content-start">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === 'pending';
            const isConfirmed = booking.status === 'confirmed';
            const isCompletionRequested = booking.status === 'completion_requested';
            const isPastEvent = new Date().toISOString().split('T')[0] > booking.date;

            const isAccepting = actionLoadingKey === `${booking.eventId}-${booking.bookingId}-confirmed`;
            const isDeclining = actionLoadingKey === `${booking.eventId}-${booking.bookingId}-declined`;
            const isRequesting = actionLoadingKey === `${booking.eventId}-${booking.bookingId}-completion_requested`;
            const isReverting = actionLoadingKey === `${booking.eventId}-${booking.bookingId}-pending`;
            const isCardBusy = actionLoadingKey?.startsWith(`${booking.eventId}-${booking.bookingId}`);

            return (
              <div 
                key={`${booking.eventId}-${booking.bookingId}`}
                className="bg-zinc-100 rounded-xl p-3 shadow-xs hover:border-zinc-400 transition-all border border-zinc-300 flex flex-col justify-between gap-2.5 min-w-0 overflow-hidden"
              >
                {/* Header: Event Type & Name (Left) + Estimated Fee (Right) */}
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block truncate">
                        {booking.eventType}
                      </span>
                      <h3 className="text-sm font-bold text-zinc-950 truncate break-words [overflow-wrap:anywhere]" title={booking.eventName}>
                        {booking.eventName}
                      </h3>
                    </div>

                    {/* Estimated Fee displayed in top right */}
                    <div className="text-right shrink-0 bg-zinc-200/80 border border-zinc-300/80 px-2 py-0.5 rounded-lg">
                      <span className="text-[9px] text-zinc-500 font-semibold block uppercase tracking-wide">
                        Fee
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-green-800">
                        ₹{booking.cost}
                      </span>
                    </div>
                  </div>

                  {/* Side-by-Side Metadata Rows */}
                  <div className="mt-2 pt-1.5 border-t border-zinc-200/90 flex flex-col gap-1 text-[11px] min-w-0">
                    {/* Row 1: Location & Date Side by Side */}
                    <div className="grid grid-cols-2 gap-2 min-w-0">
                      <div className="truncate min-w-0">
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block">Location</span>
                        <span className="text-zinc-800 font-medium truncate block" title={booking.location}>
                          {booking.location}
                        </span>
                      </div>
                      <div className="truncate min-w-0">
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block">Date</span>
                        <span className="text-zinc-800 font-medium truncate block">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Client & Client Email Side by Side */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-200/60 min-w-0">
                      <div className="truncate min-w-0">
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block">Client</span>
                        <span className="text-zinc-900 font-semibold truncate block" title={booking.creator?.name}>
                          {booking.creator?.name || 'Client'}
                        </span>
                      </div>
                      <div className="truncate min-w-0">
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block">Email</span>
                        {booking.creator?.email ? (
                          <a 
                            href={`mailto:${booking.creator?.email}`} 
                            className="text-[#03089a] font-medium truncate block hover:underline"
                            title={booking.creator?.email}
                          >
                            {booking.creator?.email}
                          </a>
                        ) : (
                          <span className="text-zinc-500 font-medium">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Only for Pending & Confirmed - No Neon Colors */}
                {(isPending || isConfirmed || isCompletionRequested) && (
                  <div className="pt-2 border-t border-zinc-200/90">
                    {/* PENDING: Accept / Decline buttons (Accept disabled if event date passed) */}
                    {isPending && (
                      <div className="flex items-center gap-2">
                        {isPastEvent ? (
                          <span className="flex-1 text-center bg-zinc-200/90 text-zinc-500 font-medium py-1.5 px-2 rounded-lg text-[10px] border border-zinc-300">
                            Date Passed
                          </span>
                        ) : (
                          <button
                            disabled={isCardBusy}
                            onClick={() => handleStatusChange(booking.eventId, booking.bookingId, 'confirmed')}
                            className="flex-1 bg-green-700 hover:bg-green-800 text-zinc-100 font-semibold py-1.5 px-2 rounded-lg text-xs transition shadow-xs disabled:opacity-60"
                          >
                            {isAccepting ? 'Confirming...' : 'Accept'}
                          </button>
                        )}
                        <button
                          disabled={isCardBusy}
                          onClick={() => handleStatusChange(booking.eventId, booking.bookingId, 'declined')}
                          className="flex-1 bg-zinc-200 hover:bg-red-100/70 text-red-700 border border-zinc-300 hover:border-red-300 font-medium py-1.5 px-2 rounded-lg text-xs transition disabled:opacity-60"
                        >
                          {isDeclining ? 'Declining...' : 'Decline'}
                        </button>
                      </div>
                    )}

                    {/* CONFIRMED: Mark Delivered + Revert option */}
                    {isConfirmed && (
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={isCardBusy}
                          onClick={() => handleStatusChange(booking.eventId, booking.bookingId, 'completion_requested')}
                          className="flex-1 bg-[#03089a] hover:bg-blue-900 text-zinc-100 font-semibold py-1.5 px-2.5 rounded-lg text-xs transition shadow-xs disabled:opacity-60 truncate"
                          title="Mark Delivered and request client payment settlement"
                        >
                          {isRequesting ? 'Requesting...' : 'Mark Delivered'}
                        </button>
                        <button
                          disabled={isCardBusy}
                          onClick={() => handleStatusChange(booking.eventId, booking.bookingId, 'pending')}
                          className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 border border-zinc-300 font-medium py-1.5 px-2 rounded-lg text-xs transition disabled:opacity-60 shrink-0"
                          title="Revert back to pending inquiry"
                        >
                          {isReverting ? 'Reverting...' : 'Revert'}
                        </button>
                      </div>
                    )}

                    {/* AWAITING CLIENT ACKNOWLEDGMENT - Subtle muted styling */}
                    {isCompletionRequested && (
                      <div className="text-center py-1 px-2 text-[10px] font-medium text-zinc-600 bg-zinc-200/80 rounded-md border border-zinc-300/80">
                        Delivered. Awaiting client settlement.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ServiceProviderBookings;
