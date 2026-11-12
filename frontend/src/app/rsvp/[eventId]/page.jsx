"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { url } from '@/conf';
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiUserGroup, 
  HiCheckCircle, 
  HiXCircle, 
  HiMail,
  HiOutlineChatAlt2
} from 'react-icons/hi';
import Link from 'next/link';
import { Logo } from '@/components';

export default function PublicRSVPPage() {
  const params = useParams();
  const eventId = params?.eventId;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Invitee identification
  const [guestId, setGuestId] = useState('');
  const [isIdentifiedGuest, setIsIdentifiedGuest] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('attending');
  const [headcount, setHeadcount] = useState(1);
  const [dietary, setDietary] = useState('None');
  const [note, setNote] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchPublicEvent() {
      if (!eventId) return;
      try {
        setLoading(true);

        // Check for personalized RSVP parameters
        let searchGuestId = '';
        let searchEmail = '';
        let searchName = '';
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          searchGuestId = urlParams.get('guestId') || '';
          searchEmail = urlParams.get('email') || '';
          searchName = urlParams.get('name') || '';
        }

        const queryStr = new URLSearchParams({
          ...(searchGuestId && { guestId: searchGuestId }),
          ...(searchEmail && { email: searchEmail })
        }).toString();

        const endpoint = `${url}/api/public/event/${eventId}${queryStr ? `?${queryStr}` : ''}`;
        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error('Event not found or has been removed.');
        }
        const data = await res.json();
        setEvent(data.event);

        if (data.guest) {
          setGuestId(data.guest.id || searchGuestId);
          setName(data.guest.name || searchName);
          setEmail(data.guest.email || searchEmail);
          setPhone(data.guest.phone || '');
          if (data.guest.rsvpStatus && data.guest.rsvpStatus !== 'pending') {
            setStatus(data.guest.rsvpStatus);
            setHeadcount(data.guest.headcount || 1);
            setDietary(data.guest.dietary || 'None');
            setNote(data.guest.note || '');
            setSubmitted(true);
          }
          setIsIdentifiedGuest(true);
        } else if (searchName || searchEmail) {
          setGuestId(searchGuestId);
          setName(searchName);
          setEmail(searchEmail);
          if (searchEmail) {
            setIsIdentifiedGuest(true);
          }
        }
      } catch (err) {
        setError(err.message || 'Unable to load event invitation.');
      } finally {
        setLoading(false);
      }
    }
    fetchPublicEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${url}/api/public/event/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          rsvpStatus: status,
          headcount: status === 'attending' ? headcount : 0,
          dietary: status === 'attending' ? dietary : 'None',
          note: note.trim()
        })
      });

      if (!res.ok) {
        throw new Error('Failed to record RSVP. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Error submitting RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-200 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#03089a]"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-zinc-200 flex items-center justify-center p-4">
        <div className="bg-zinc-100 rounded-2xl p-8 max-w-md w-full shadow-xs text-center border border-zinc-300">
          <div className="w-14 h-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            <HiXCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-zinc-950 mb-2">Invitation Not Found</h2>
          <p className="text-zinc-600 text-sm mb-6">{error || 'This invitation link may be invalid or expired.'}</p>
          <Link href="/" className="inline-block bg-[#03089a] text-zinc-100 px-6 py-2.5 rounded-xl font-medium text-xs hover:bg-[#020677] transition shadow-xs">
            Go to Eventra Home
          </Link>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const isPast = event.date < todayStr;

  return (
    <div className="min-h-screen bg-zinc-100 py-10 px-4 flex flex-col justify-between items-center selection:bg-[#03089a] selection:text-white">
      <div className="max-w-lg mx-auto w-full">
        {/* Brand Header */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-block hover:opacity-90 transition">
            <Logo />
          </Link>
        </div>

        {/* Invitation Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-zinc-200/60 overflow-hidden border border-zinc-200 mb-6">
          {/* Header Banner */}
          <div className="bg-[#03089a] text-zinc-100 px-6 py-8 text-center relative">
            <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-xs">
              <HiMail size={14} className="text-zinc-200" />
              <span>Event Invitation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 leading-snug">
              {event.eventName}
            </h1>
            <p className="text-zinc-300 text-xs sm:text-sm font-medium">
              Hosted by <strong className="text-white font-semibold">{event.creatorName}</strong>
            </p>
          </div>

          {/* Event Quick Meta Bar */}
          <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-700">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#03089a]/10 text-[#03089a] shrink-0">
                <HiCalendar size={18} />
              </div>
              <div>
                <span className="text-zinc-400 font-bold block text-[10px] uppercase tracking-wider">Date</span>
                <span className="font-bold text-zinc-900 text-xs">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#03089a]/10 text-[#03089a] shrink-0">
                <HiLocationMarker size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-zinc-400 font-bold block text-[10px] uppercase tracking-wider">Location</span>
                <span className="font-bold text-zinc-900 text-xs truncate block" title={event.location}>
                  {event.location}
                </span>
              </div>
            </div>
          </div>

          {/* RSVP Form Body */}
          <div className="p-6 sm:p-8">
            {isPast ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HiCalendar size={22} />
                </div>
                <h3 className="text-base font-bold text-zinc-900">Event has concluded</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  This event took place on {event.date}. RSVP responses are now closed.
                </p>
              </div>
            ) : submitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <HiCheckCircle size={32} />
                </div>
                <h2 className="text-xl font-extrabold text-zinc-950 mb-1">You&apos;ve already responded</h2>
                <p className="text-zinc-600 text-xs sm:text-sm max-w-sm mx-auto mb-5">
                  Thank you, <strong className="text-zinc-900">{name}</strong>. Your RSVP response has already been recorded for this event.
                </p>

                <div className="bg-zinc-50 rounded-2xl p-4 max-w-sm mx-auto border border-zinc-200 text-left text-xs mb-5">
                  <div className="flex justify-between py-1.5 border-b border-zinc-200">
                    <span className="text-zinc-500 font-medium">Your Response:</span>
                    <span className={`font-bold capitalize ${status === 'attending' ? 'text-emerald-700' : 'text-red-700'}`}>
                      {status === 'attending' ? 'Attending' : 'Declined'}
                    </span>
                  </div>
                  {status === 'attending' && (
                    <>
                      <div className="flex justify-between py-1.5 border-b border-zinc-200">
                        <span className="text-zinc-500 font-medium">Total Guests:</span>
                        <span className="font-bold text-zinc-900">{headcount} {headcount === 1 ? 'Guest' : 'Guests'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-zinc-200">
                        <span className="text-zinc-500 font-medium">Dietary:</span>
                        <span className="font-bold text-zinc-900">{dietary}</span>
                      </div>
                    </>
                  )}
                  {note && (
                    <div className="pt-2 border-t border-zinc-200 mt-2 text-zinc-600 italic break-words [overflow-wrap:anywhere]">
                      &quot;{note}&quot;
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-[#03089a] hover:underline cursor-pointer"
                >
                  Edit your response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Identification Banner or Inputs */}
                {isIdentifiedGuest ? (
                  <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#03089a]/10 text-[#03089a] font-black text-sm flex items-center justify-center shrink-0">
                        {name ? name.charAt(0).toUpperCase() : 'G'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-zinc-900 truncate">{name}</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded-md shrink-0 inline-flex items-center gap-1">
                            <HiCheckCircle size={12} className="text-emerald-700" />
                            <span>Verified Invitee</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                          {email}{email && phone ? ' • ' : ''}{phone}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsIdentifiedGuest(false);
                        setGuestId('');
                        setName('');
                        setEmail('');
                        setPhone('');
                      }}
                      className="text-xs font-semibold text-[#03089a] hover:underline shrink-0 ml-3 cursor-pointer"
                    >
                      Not you?
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                    <p className="text-[11px] text-zinc-600 font-medium">
                      Enter your details to register your RSVP with the host.
                    </p>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1">
                        Your Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#03089a] text-xs font-medium text-zinc-900 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#03089a] text-xs font-medium text-zinc-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#03089a] text-xs font-medium text-zinc-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Will you be attending? */}
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-2">
                    Will you be attending?
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStatus('attending')}
                      className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        status === 'attending'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <HiCheckCircle size={18} className={status === 'attending' ? 'text-emerald-700' : 'text-zinc-400'} />
                      <span>Yes, Attending</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('declined')}
                      className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        status === 'declined'
                          ? 'border-red-600 bg-red-50 text-red-800 ring-2 ring-red-500/20'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <HiXCircle size={18} className={status === 'declined' ? 'text-red-700' : 'text-zinc-400'} />
                      <span>Cannot Attend</span>
                    </button>
                  </div>
                </div>

                {/* Attendance details if attending */}
                {status === 'attending' && (
                  <div className="space-y-4 pt-3 border-t border-zinc-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1">
                          Total Guests (Including You)
                        </label>
                        <select
                          value={headcount}
                          onChange={(e) => setHeadcount(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#03089a] text-xs font-medium text-zinc-900 bg-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Guest (Just Me)' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1">
                          Dietary Preference
                        </label>
                        <select
                          value={dietary}
                          onChange={(e) => setDietary(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#03089a] text-xs font-medium text-zinc-900 bg-white"
                        >
                          <option value="None">No Restrictions</option>
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Non-Vegetarian">Non-Vegetarian</option>
                          <option value="Vegan">Vegan</option>
                          <option value="Jain">Jain / Sattvic</option>
                          <option value="Gluten-Free">Gluten-Free</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide">
                          Note to the Host (Optional)
                        </label>
                        <span className={`text-[10px] ${note.length >= 250 ? 'text-red-600 font-bold' : 'text-zinc-400'}`}>
                          {note.length}/250
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        maxLength={250}
                        placeholder="Can't wait to celebrate together!"
                        value={note}
                        onChange={(e) => setNote(e.target.value.slice(0, 250))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#03089a] text-xs font-medium text-zinc-900 bg-white resize-none"
                      />
                    </div>
                  </div>
                )}

                {status === 'declined' && (
                  <div className="pt-2 border-t border-zinc-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide">
                        Message to the Host (Optional)
                      </label>
                      <span className={`text-[10px] ${note.length >= 250 ? 'text-red-600 font-bold' : 'text-zinc-400'}`}>
                        {note.length}/250
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={250}
                      placeholder="Sorry I can't make it! Wishing you a wonderful event..."
                      value={note}
                      onChange={(e) => setNote(e.target.value.slice(0, 250))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#03089a] text-xs font-medium text-zinc-900 bg-white resize-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#03089a] hover:bg-[#020677] text-white font-bold py-3 px-4 rounded-xl transition shadow-xs disabled:opacity-60 text-xs sm:text-sm cursor-pointer"
                >
                  {submitting ? 'Submitting RSVP...' : 'Confirm RSVP'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="text-center text-xs text-zinc-400">
          <span>Powered by </span>
          <Link href="/" className="font-bold text-zinc-600 hover:text-[#03089a]">
            Eventra
          </Link>
          <span> • Digital Event Management</span>
        </div>
      </div>
    </div>
  );
}
