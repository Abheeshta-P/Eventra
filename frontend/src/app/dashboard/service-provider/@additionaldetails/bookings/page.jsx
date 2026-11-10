"use client";
import React, { useState, useEffect, useCallback } from 'react';
import serviceProviderService from '@/utils/serviceProvider';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiUser, 
  HiMail, 
  HiCheckCircle, 
  HiXCircle, 
  HiFilter
} from 'react-icons/hi';
import { Loading } from '@/components';

function ServiceProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceProviderService.getBookings();
      if (data && Array.isArray(data)) {
        setBookings(data);
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
    const actionLabel = 
      newStatus === 'confirmed' ? 'Accept this booking' :
      newStatus === 'declined' ? 'Decline this booking' : 
      'Mark this service as Delivered';

    const actionText = 
      newStatus === 'completion_requested'
        ? 'The client will receive an acknowledgment prompt on their dashboard to confirm service delivery and verify that any offline payment has been settled.'
        : 'The client will be notified of your response.';

    const result = await Swal.fire({
      title: `${actionLabel}?`,
      text: actionText,
      icon: newStatus === 'declined' ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'declined' ? '#d33' : '#03089a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: newStatus === 'completion_requested' ? 'Yes, Request Completion' : `Yes, ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const res = await serviceProviderService.updateBookingStatus(eventId, serviceId, newStatus);
        if (res) {
          Swal.fire({
            title: 'Updated!',
            text: `Booking has been marked as ${newStatus}.`,
            icon: 'success',
            timer: 2000,
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
        setActionLoading(false);
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  if (loading) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-100 p-2.5 rounded-xl shadow-xs border border-zinc-300">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'completed', 'declined'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`capitalize px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filter === tab 
                  ? 'bg-[#03089a] text-zinc-100 shadow-xs' 
                  : 'text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950'
              }`}
            >
              {tab}
              {tab === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 bg-amber-600 text-amber-50 text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <span className="text-xs text-zinc-600 px-2 font-medium">
          Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
        </span>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-zinc-100 rounded-2xl p-12 text-center border border-dashed border-zinc-300">
          <div className="w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center mx-auto text-zinc-500 mb-4">
            <HiFilter size={32} />
          </div>
          <h3 className="text-lg font-semibold text-zinc-800">No bookings in this tab</h3>
          <p className="text-sm text-zinc-600 mt-1">
            {filter === 'all' 
              ? "You haven't been selected for any events yet. Check back soon!" 
              : `No bookings found with status '${filter}'.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((booking) => {
            const statusConfig = {
              pending: { bg: 'bg-amber-100/90', text: 'text-amber-900', border: 'border-amber-300', label: 'Pending Review' },
              confirmed: { bg: 'bg-emerald-100/90', text: 'text-emerald-900', border: 'border-emerald-300', label: 'Confirmed' },
              completion_requested: { bg: 'bg-purple-100/90', text: 'text-purple-900', border: 'border-purple-300', label: 'Awaiting Client Acknowledgment' },
              declined: { bg: 'bg-rose-100/90', text: 'text-rose-900', border: 'border-rose-300', label: 'Declined' },
              completed: { bg: 'bg-blue-100/90', text: 'text-blue-900', border: 'border-blue-300', label: 'Completed' }
            }[booking.status] || { bg: 'bg-zinc-200', text: 'text-zinc-800', border: 'border-zinc-300', label: booking.status };

            return (
              <div 
                key={`${booking.eventId}-${booking.bookingId}`}
                className="bg-zinc-100 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all border border-zinc-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-bold text-zinc-500">
                        {booking.eventType}
                      </span>
                      <h3 className="text-xl font-bold text-zinc-950 mt-0.5">
                        {booking.eventName}
                      </h3>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-zinc-700 mb-4 border-t border-b border-zinc-200 py-3">
                    <div className="flex items-center gap-2">
                      <HiCalendar className="text-[#03089a] shrink-0" size={18} />
                      <span className="font-medium text-zinc-800">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiLocationMarker className="text-[#03089a] shrink-0" size={18} />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiUser className="text-[#03089a] shrink-0" size={18} />
                      <span>Client: <strong className="text-zinc-950">{booking.creator?.name}</strong></span>
                    </div>
                    {booking.creator?.email && (
                      <div className="flex items-center gap-2">
                        <HiMail className="text-[#03089a] shrink-0" size={18} />
                        <a href={`mailto:${booking.creator?.email}`} className="text-[#03089a] hover:underline">
                          {booking.creator?.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Quoted Service & Cost */}
                  <div className="flex items-center justify-between bg-zinc-200/80 border border-zinc-300/80 rounded-xl p-3 mb-4">
                    <div>
                      <p className="text-xs text-zinc-600 font-medium">{booking.category}</p>
                      <p className="text-sm font-bold text-zinc-900">{booking.serviceName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-600 font-medium">Estimated Fee</p>
                      <p className="text-base font-extrabold text-green-800">₹{booking.cost}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  {booking.status === 'pending' && (
                    <div className="flex items-center gap-3">
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusChange(booking.eventId, booking.bookingId, 'confirmed')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-800 text-zinc-100 font-medium py-2 px-3 rounded-xl transition text-sm shadow-xs"
                      >
                        <HiCheckCircle size={18} />
                        Accept
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusChange(booking.eventId, booking.bookingId, 'declined')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-200 hover:bg-red-100/70 text-red-700 border border-zinc-300 hover:border-red-300 font-medium py-2 px-3 rounded-xl transition text-sm"
                      >
                        <HiXCircle size={18} />
                        Decline
                      </button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleStatusChange(booking.eventId, booking.bookingId, 'completion_requested')}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#03089a] hover:bg-blue-900 text-zinc-100 font-medium py-2 px-4 rounded-xl transition text-sm shadow-xs"
                    >
                      <HiCheckCircle size={18} />
                      Mark Delivered (Request Client Acknowledgment)
                    </button>
                  )}

                  {booking.status === 'completion_requested' && (
                    <div className="text-center py-2 px-3 text-xs font-semibold text-purple-900 bg-purple-100/70 rounded-xl border border-purple-300">
                      Service delivered. Awaiting client to confirm and settle offline payment.
                    </div>
                  )}

                  {booking.status === 'completed' && (
                    <div className="text-center py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/70 rounded-xl border border-emerald-300">
                      Service Completed & Settled with Client
                    </div>
                  )}

                  {booking.status === 'declined' && (
                    <div className="text-center py-1.5 text-xs font-semibold text-rose-900 bg-rose-100/70 rounded-xl border border-rose-300">
                      You declined this inquiry
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ServiceProviderBookings;