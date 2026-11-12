"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import { 
  addParticipant, 
  addMultipleParticipants, 
  toggleParticipant, 
  deleteParticipant, 
  setInitialParticipants,
  markInvitesSent
} from '@/store/features/participantSlice';
import { eventCreatorService } from '@/utils';
import { HiChatAlt2, HiTrash, HiSearch, HiX } from 'react-icons/hi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const MAX_BULK_LIMIT = 100;

const isValidEmail = (email) => {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
};

const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return true;
  if (digits.length === 12 && digits.startsWith('91') && /^91[6-9]\d{9}$/.test(digits)) return true;
  return false;
};

function ParticipantList({ eventId, isCreating = false, setHasChanges, isDisabled }) {
  const dispatch = useDispatch();
  const participants = useSelector(state => state.participantsList.participantList);

  // Form states
  const [entryMode, setEntryMode] = useState('single'); // 'single' | 'bulk'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [sendingInvites, setSendingInvites] = useState(false);
  const [sendingSingleId, setSendingSingleId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const unsentParticipants = participants.filter(p => isValidEmail(p.email) && !p.inviteSent);
  const unsentEmailsCount = unsentParticipants.length;
  const sentInvitesCount = participants.filter(p => p.inviteSent).length;
  const unsentIds = unsentParticipants.map(p => p.id || p._id);
  const isAllUnsentSelected = unsentIds.length > 0 && (
    unsentIds.length <= 50
      ? unsentIds.every(id => selectedIds.includes(id))
      : selectedIds.length === 50
  );

  const displayedParticipants = participants.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q))
    );
  });

  const handleAddSingle = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      Swal.fire('Validation Error', 'Please enter the invitee\'s name.', 'warning');
      return;
    }

    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      Swal.fire('Invalid Email', 'Please enter a valid email address (e.g. name@example.com).', 'warning');
      return;
    }

    if (trimmedPhone && !PHONE_REGEX.test(trimmedPhone)) {
      Swal.fire('Invalid Phone', 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.', 'warning');
      return;
    }

    // Check duplicate
    const isDuplicate = participants.some(
      (p) =>
        p.name.toLowerCase() === trimmedName.toLowerCase() ||
        (trimmedEmail && p.email && p.email.toLowerCase() === trimmedEmail.toLowerCase())
    );

    if (isDuplicate) {
      Swal.fire('Duplicate Invitee', 'An invitee with this name or email is already on the list!', 'warning');
      return;
    }

    const participantInfo = { 
      id: nanoid(), 
      sno: participants.length + 1, 
      name: trimmedName, 
      email: trimmedEmail,
      phone: trimmedPhone,
      completed: false,
      rsvpStatus: 'pending',
      headcount: 1,
      dietary: 'None',
      note: '',
      inviteSent: false
    };

    dispatch(addParticipant(participantInfo));
    setName('');
    setEmail('');
    setPhone('');
    setHasChanges(true);

    if (!isCreating && eventId) {
      const updatedList = [...participants, participantInfo];
      eventCreatorService.updateEventDetails(eventId, { participants: updatedList })
        .then((res) => {
          if (res?.event?.participants) {
            dispatch(setInitialParticipants(res.event.participants));
            setHasChanges(false);
          }
        })
        .catch(err => console.error('Failed to auto-save added invitee:', err));
    }
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) {
      Swal.fire('Notice', 'Please paste contact details to import.', 'info');
      return;
    }

    let rawLines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    if (rawLines.length === 0) return;

    let wasTruncated = false;
    if (rawLines.length > MAX_BULK_LIMIT) {
      wasTruncated = true;
      rawLines = rawLines.slice(0, MAX_BULK_LIMIT);
    }

    const newItems = [];
    let duplicatesCount = 0;
    let invalidCount = 0;

    rawLines.forEach((line) => {
      // Split by comma, tab, semicolon or pipe
      const parts = line.split(/[,;\t|]+/).map(p => p.trim()).filter(Boolean);
      if (parts.length === 0) return;

      const contactName = parts[0];
      if (!contactName || contactName.length < 2) {
        invalidCount++;
        return;
      }

      let contactEmail = '';
      let contactPhone = '';

      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (part.includes('@')) {
          if (EMAIL_REGEX.test(part)) {
            contactEmail = part.toLowerCase();
          } else {
            invalidCount++;
          }
        } else {
          const cleanDigits = part.replace(/\D/g, '');
          if (PHONE_REGEX.test(cleanDigits)) {
            contactPhone = cleanDigits;
          } else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
            const indNumber = cleanDigits.slice(2);
            if (PHONE_REGEX.test(indNumber)) {
              contactPhone = indNumber;
            }
          }
        }
      }

      // Check duplicates
      const isDuplicate = participants.some(p => 
        p.name.toLowerCase() === contactName.toLowerCase() || 
        (contactEmail && p.email && p.email.toLowerCase() === contactEmail)
      ) || newItems.some(p => 
        p.name.toLowerCase() === contactName.toLowerCase() || 
        (contactEmail && p.email && p.email.toLowerCase() === contactEmail)
      );

      if (isDuplicate) {
        duplicatesCount++;
        return;
      }

      newItems.push({
        id: nanoid(),
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        rsvpStatus: 'pending',
        headcount: 1,
        dietary: 'None',
        note: '',
        inviteSent: false
      });
    });

    if (newItems.length > 0) {
      dispatch(addMultipleParticipants(newItems));
      setBulkText('');
      setHasChanges(true);

      if (!isCreating && eventId) {
        const updatedList = [...participants, ...newItems];
        eventCreatorService.updateEventDetails(eventId, { participants: updatedList })
          .then((res) => {
            if (res?.event?.participants) {
              dispatch(setInitialParticipants(res.event.participants));
              setHasChanges(false);
            }
          })
          .catch(err => console.error('Failed to auto-save bulk invitees:', err));
      }

      let msg = `Added ${newItems.length} invitee(s).`;
      if (duplicatesCount > 0) msg += ` (${duplicatesCount} duplicates skipped)`;
      if (invalidCount > 0) msg += ` (${invalidCount} invalid entries ignored)`;
      if (wasTruncated) msg += ` [Batch limited to max ${MAX_BULK_LIMIT} contacts per import]`;

      Swal.fire({
        title: 'Import Complete',
        text: msg,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      Swal.fire('Notice', 'No new valid contacts could be imported. They may already be on the list or contain invalid formatting.', 'info');
    }
  };

  const handleToggleSelectAll = () => {
    if (isAllUnsentSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(unsentIds.slice(0, 50));
    }
  };

  const handleToggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 50) {
        Swal.fire({
          title: 'Batch Cap Reached (50)',
          text: 'You can select up to 50 recipients per batch to prevent email server throttling. Please dispatch this batch first before selecting more.',
          icon: 'info',
          confirmButtonColor: '#03089a'
        });
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSendSelectedInvites = async () => {
    if (isCreating || !eventId) {
      Swal.fire({
        title: 'Submit Event First',
        text: 'Automated email invitations are ready to send as soon as you submit and create this event.',
        icon: 'info',
        confirmButtonColor: '#03089a'
      });
      return;
    }

    if (selectedIds.length === 0) {
      Swal.fire('Notice', 'Please select at least one invitee to send email invitations.', 'info');
      return;
    }

    const count = selectedIds.length;
    const result = await Swal.fire({
      title: `Send ${count} Selected Email Invite(s)?`,
      text: `An invitation email with event details and a direct RSVP link will be sent to the ${count} selected guest(s).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#03089a',
      cancelButtonColor: '#52525b',
      confirmButtonText: `Yes, Send to ${count} Now`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setSendingInvites(true);
      try {
        const res = await eventCreatorService.sendEventInvites(eventId, selectedIds);
        if (res?.success) {
          Swal.fire({
            title: 'Invitations Dispatched',
            text: res.message || `Sent ${res.sentCount} invitation(s).`,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          });
          if (Array.isArray(res.sentEmails) && res.sentEmails.length > 0) {
            dispatch(markInvitesSent({ sentEmails: res.sentEmails, sentIds: selectedIds }));
          }
          if (Array.isArray(res.participants)) {
            dispatch(setInitialParticipants(res.participants));
          }
          setSelectedIds([]);
        } else {
          Swal.fire('Error', res?.error || 'Failed to dispatch email invitations.', 'error');
        }
      } catch (err) {
        console.error('Error sending invitations:', err);
        Swal.fire('Error', 'An unexpected error occurred while sending invites.', 'error');
      } finally {
        setSendingInvites(false);
      }
    }
  };

  const handleSendIndividualInvite = async (participant) => {
    if (isCreating || !eventId) {
      Swal.fire({
        title: 'Submit Event First',
        text: 'Automated email invitations are ready to send as soon as you submit this event.',
        icon: 'info',
        confirmButtonColor: '#03089a'
      });
      return;
    }

    if (!participant.email) {
      Swal.fire('Notice', 'This contact does not have an email address.', 'info');
      return;
    }

    const targetId = participant.id || participant._id || participant.email;
    setSendingSingleId(targetId);

    try {
      const res = await eventCreatorService.sendEventInvites(eventId, [targetId]);
      if (res?.success) {
        dispatch(markInvitesSent({ sentEmails: [participant.email], sentIds: [targetId] }));
        if (Array.isArray(res.participants)) {
          dispatch(setInitialParticipants(res.participants));
        }
        Swal.fire({
          title: 'Invitation Sent',
          text: `Invitation email dispatched to ${participant.name} (${participant.email}).`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire('Error', res?.error || 'Failed to dispatch invitation email.', 'error');
      }
    } catch (err) {
      console.error('Error sending individual invite:', err);
      Swal.fire('Error', 'An unexpected error occurred while sending invite.', 'error');
    } finally {
      setSendingSingleId(null);
    }
  };

  const handleIndividualWhatsApp = (participant) => {
    if (!isValidPhone(participant.phone)) {
      Swal.fire('Invalid Phone', 'This contact does not have a valid 10-digit Indian phone number.', 'warning');
      return;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pId = participant.id || participant._id || '';
    const params = new URLSearchParams({
      guestId: pId.toString(),
      email: participant.email || '',
      name: participant.name || ''
    }).toString();
    const rsvpLink = eventId ? `${origin}/rsvp/${eventId}?${params}` : origin;
    let digits = (participant.phone || '').replace(/\D/g, '');
    if (digits.length === 10) digits = `91${digits}`;
    const msg = `Hi ${participant.name}, you are invited! Please view event details and RSVP here: ${rsvpLink}`;
    const url = `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleToggle = async (id) => {
    dispatch(toggleParticipant({ id }));
    setHasChanges(true);
    if (!isCreating && eventId) {
      const updatedList = participants.map(p => 
        (p.id === id || p._id === id) ? { ...p, completed: !p.completed } : p
      );
      try {
        const res = await eventCreatorService.updateEventDetails(eventId, { participants: updatedList });
        if (res?.event?.participants) {
          dispatch(setInitialParticipants(res.event.participants));
          setHasChanges(false);
        }
      } catch (err) {
        console.error('Failed to auto-save check-in toggle:', err);
      }
    }
  };

  const handleDelete = async (id) => {
    dispatch(deleteParticipant({ id }));
    setHasChanges(true);
    if (!isCreating && eventId) {
      const updatedList = participants.filter(p => p.id !== id && p._id !== id);
      try {
        const res = await eventCreatorService.updateEventDetails(eventId, { participants: updatedList });
        if (res?.event?.participants) {
          dispatch(setInitialParticipants(res.event.participants));
          setHasChanges(false);
        }
      } catch (err) {
        console.error('Failed to auto-save delete invitee:', err);
      }
    }
  };

  return (
    <div
      className={`p-1 w-full max-w-3xl text-xs sm:text-sm ${
        isDisabled ? 'opacity-95' : ''
      }`}
    >
      {/* 1. Add Invitee Area with Mode Switch - Positioned at TOP */}
      {isDisabled ? (
        <div className="mb-3 bg-zinc-200/50 p-3 rounded-xl border border-zinc-300 text-center text-xs text-zinc-500 font-medium cursor-not-allowed select-none">
          Event completed. Invitee and RSVP list is locked in read-only mode.
        </div>
      ) : (
        <div className="mb-3 bg-zinc-100 p-3.5 rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="inline-flex p-0.5 rounded-lg bg-zinc-200/80 border border-zinc-300/80">
              <button
                type="button"
                onClick={() => setEntryMode('single')}
                className={`text-xs font-semibold px-3 py-1 rounded-md transition cursor-pointer ${
                  entryMode === 'single'
                    ? 'bg-[#03089a] text-zinc-100 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Add Single Invitee
              </button>
              <button
                type="button"
                onClick={() => setEntryMode('bulk')}
                className={`text-xs font-semibold px-3 py-1 rounded-md transition cursor-pointer ${
                  entryMode === 'bulk'
                    ? 'bg-[#03089a] text-zinc-100 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Bulk Import (Paste / CSV)
              </button>
            </div>

            <span className="text-[11px] text-zinc-500 font-medium">
              Quick Invitee Add
            </span>
          </div>

          {entryMode === 'single' ? (
            <form onSubmit={handleAddSingle} className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-zinc-300 rounded-xl px-3 py-2 text-xs flex-grow focus:outline-none focus:border-[#03089a] w-full sm:w-auto bg-zinc-50 text-zinc-900"
                placeholder="Full Name *"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-zinc-300 rounded-xl px-3 py-2 text-xs flex-grow focus:outline-none focus:border-[#03089a] w-full sm:w-auto bg-zinc-50 text-zinc-900"
                placeholder="Email (for auto-invite)"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setPhone(val);
                }}
                className="border border-zinc-300 rounded-xl px-3 py-2 text-xs flex-grow focus:outline-none focus:border-[#03089a] w-full sm:w-auto bg-zinc-50 text-zinc-900"
                placeholder="Phone (optional)"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#03089a] hover:bg-[#020677] text-zinc-100 rounded-xl text-xs font-semibold transition-all w-full sm:w-auto shrink-0 cursor-pointer shadow-none"
              >
                Add Invitee
              </button>
            </form>
          ) : (
            <div className="space-y-2 w-full">
              <textarea
                rows={3}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Paste contacts here, one per line:&#10;Rahul Sharma, rahul@gmail.com, 9876543210&#10;Priya Patel, priya@gmail.com&#10;Amit Verma, amit@gmail.com"
                className="w-full border border-zinc-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#03089a] bg-zinc-50 text-zinc-900 font-mono"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-zinc-200">
                <div className="flex flex-col gap-0.5 text-[11px] text-zinc-600">
                  <span><strong>Format:</strong> <code>Name, Email, Phone</code> — separated by commas or tabs.</span>
                  <span className="text-zinc-500">
                    Max 100 contacts per import batch. Multiple imports supported. Email selection capped at 50 per dispatch.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="px-4 py-1.5 bg-[#03089a] hover:bg-[#020677] text-zinc-100 rounded-xl text-xs font-semibold transition-all w-full sm:w-auto shrink-0 cursor-pointer shadow-none"
                >
                  Import Contacts
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. List Header, Filter & Batch Action Bar */}
      <div className="bg-zinc-100 p-3 rounded-2xl border border-zinc-300 mb-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-zinc-900">
              Guest List ({participants?.length || 0})
            </span>
            {sentInvitesCount > 0 && (
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                {sentInvitesCount} invited
              </span>
            )}
            {unsentEmailsCount > 0 && !isDisabled && (
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                {unsentEmailsCount} pending email(s)
              </span>
            )}
            {isDisabled && (
              <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-200 border border-zinc-300 px-2 py-0.5 rounded-full">
                Read-Only
              </span>
            )}
          </div>

          {/* Quick Search Filter */}
          {participants.length > 0 && (
            <div className="relative w-full sm:w-56">
              <HiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, phone..."
                className="w-full pl-8 pr-7 py-1 text-xs border border-zinc-300 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:border-[#03089a]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  title="Clear search"
                >
                  <HiX size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Batch Email Actions */}
        {!isCreating && eventId && unsentEmailsCount > 0 && !isDisabled && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-200">
            <label 
              className="flex items-center gap-1.5 text-xs text-zinc-700 cursor-pointer select-none bg-zinc-200/70 hover:bg-zinc-200 px-2 py-1 rounded-md border border-zinc-300"
              title={unsentIds.length > 50 ? "Selects the maximum batch limit of 50 pending recipients" : "Select all pending recipients"}
            >
              <input
                type="checkbox"
                checked={isAllUnsentSelected}
                onChange={handleToggleSelectAll}
                className="accent-[#03089a] h-3.5 w-3.5 cursor-pointer rounded"
              />
              <span className="font-medium text-zinc-800 text-xs">
                {unsentIds.length > 50 ? `Select First 50 (${unsentIds.length} pending)` : `Select All (${unsentIds.length})`}
              </span>
            </label>

            <div className="flex items-center gap-2">
              {selectedIds.length >= 50 && (
                <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                  Max 50 Selected
                </span>
              )}
              <button
                type="button"
                disabled={selectedIds.length === 0 || sendingInvites}
                onClick={handleSendSelectedInvites}
                className="text-xs font-semibold bg-[#03089a] hover:bg-[#020677] text-zinc-100 px-3 py-1.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed shadow-none cursor-pointer"
                title={selectedIds.length > 0 ? `Send email invitation to ${selectedIds.length} selected recipient(s)` : 'Select at least one recipient to send'}
              >
                {sendingInvites 
                  ? 'Sending Selected...' 
                  : `Send Email to Selected (${selectedIds.length}${selectedIds.length >= 50 ? ' / Max 50' : ''})`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Scrollable Invitee List Container (Fixed Max Height with Dedicated Scroll) */}
      <div className="max-h-[460px] overflow-y-auto scrollbar-thin pr-1 border border-zinc-300/80 rounded-2xl p-2 bg-zinc-200/50">
        {displayedParticipants.length === 0 ? (
          <div className="text-center py-10 bg-zinc-100 rounded-xl border border-dashed border-zinc-300 text-zinc-500">
            {searchQuery.trim() ? (
              <>
                <p className="text-xs font-semibold text-zinc-700">No matching invitees found</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Try searching with a different name, email, or phone number.</p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-zinc-700">No invitees on the list yet</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Use the form above to add single guests or bulk import contacts.</p>
              </>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {displayedParticipants.map((participant, index) => {
          const rsvpBadge = participant.rsvpStatus === 'attending' 
            ? { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: `Attending (${participant.headcount || 1})` }
            : participant.rsvpStatus === 'declined'
            ? { bg: 'bg-red-100 text-red-800 border-red-300', text: 'Declined' }
            : { bg: 'bg-zinc-200 text-zinc-600 border-zinc-300', text: 'Pending' };

          return (
            <li 
              key={participant.id || index} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-zinc-100 border border-zinc-300 rounded-xl transition-all ${
                participant.completed ? 'opacity-70 bg-zinc-200/50' : ''
              }`}
            >
              {/* Name & Contact Details (Full width on mobile, flexible on desktop) */}
              <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                {/* Checkbox (Check-in) */}
                <input
                  type="checkbox"
                  aria-label="Door check-in"
                  disabled={isDisabled}
                  className={`mt-0.5 sm:mt-0 accent-[#03089a] h-4 w-4 shrink-0 ${
                    isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  }`}
                  checked={participant.completed}
                  onChange={() => !isDisabled && handleToggle(participant.id || participant._id)}
                />

                {/* Number Badge */}
                <div className="bg-zinc-200 text-zinc-700 text-center px-1.5 py-0.5 rounded font-bold text-xs shrink-0 cursor-default mt-0.5 sm:mt-0">
                  #{index + 1}
                </div>

                {/* Contact Info */}
                <div className="min-w-0 flex-1">
                  <p className={`font-bold text-zinc-900 break-words [overflow-wrap:anywhere] ${participant.completed ? 'line-through text-zinc-500' : ''}`}>
                    {participant.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-zinc-600 text-xs mt-0.5 break-all">
                    {participant.email && <span className="break-all">{participant.email}</span>}
                    {participant.email && participant.phone && <span>•</span>}
                    {participant.phone && <span>{participant.phone}</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px]">
                    {participant.dietary && participant.dietary !== 'None' && (
                      <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 font-medium shrink-0">
                        Diet: {participant.dietary}
                      </span>
                    )}
                    {participant.note && (
                      <span className="text-zinc-600 italic break-words flex items-center gap-1" title={participant.note}>
                        <HiChatAlt2 size={12} className="shrink-0 text-zinc-500" />
                        <span className="truncate max-w-full sm:max-w-[240px]">&quot;{participant.note}&quot;</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges & Actions (Clean responsive wrap below contact info on mobile) */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200 sm:shrink-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* RSVP Status */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${rsvpBadge.bg} cursor-default`}>
                    {rsvpBadge.text}
                  </span>

                  {/* Email Action / Status */}
                  {participant.inviteSent ? (
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded font-semibold cursor-default flex items-center gap-1">
                      <span>✓</span>
                      <span>Invite Sent</span>
                    </span>
                  ) : isValidEmail(participant.email) ? (
                    !isCreating && eventId && !isDisabled ? (
                      <div className="flex items-center gap-1.5">
                        <label className="flex items-center gap-1 text-[11px] text-zinc-700 cursor-pointer select-none bg-zinc-200/60 hover:bg-zinc-200 px-1.5 py-1 rounded border border-zinc-300" title="Select for bulk email dispatch">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(participant.id || participant._id)}
                            onChange={() => handleToggleSelectOne(participant.id || participant._id)}
                            className="accent-[#03089a] h-3.5 w-3.5 cursor-pointer rounded"
                          />
                          <span className="text-[10px] font-medium text-zinc-700">Select</span>
                        </label>
                        <button
                          type="button"
                          disabled={sendingSingleId === (participant.id || participant._id)}
                          onClick={() => handleSendIndividualInvite(participant)}
                          className="text-[11px] font-semibold bg-[#03089a] hover:bg-[#020677] text-zinc-100 px-2 py-1 rounded-md transition disabled:opacity-50 cursor-pointer shadow-none"
                          title={`Send invitation email to ${participant.name}`}
                        >
                          {sendingSingleId === (participant.id || participant._id) ? 'Sending...' : 'Send Email'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded font-medium cursor-default">
                        Unsent
                      </span>
                    )
                  ) : participant.email && participant.email.trim() ? (
                    <span className="text-[10px] text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded font-medium cursor-default" title="Invalid email address format">
                      Invalid Email
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500 bg-zinc-200 px-1.5 py-0.5 rounded font-medium cursor-default">
                      No Email
                    </span>
                  )}

                  {/* WhatsApp Share Button */}
                  {isValidPhone(participant.phone) ? (
                    !isDisabled && (
                      <button
                        type="button"
                        onClick={() => handleIndividualWhatsApp(participant)}
                        className="text-[11px] font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-2 py-1 rounded-md transition cursor-pointer"
                        title={`Send RSVP link to ${participant.name} via WhatsApp`}
                      >
                        WhatsApp
                      </button>
                    )
                  ) : participant.phone && participant.phone.trim() ? (
                    <span className="text-[10px] text-zinc-500 bg-zinc-200 border border-zinc-300 px-1.5 py-0.5 rounded font-medium cursor-default" title="Requires a 10-digit Indian phone number">
                      Invalid Phone
                    </span>
                  ) : null}
                </div>

                {/* Delete Button */}
                {!isDisabled && (
                  <button
                    type="button"
                    onClick={() => handleDelete(participant.id || participant._id)}
                    className="text-zinc-500 hover:text-red-700 p-1.5 rounded-lg transition shrink-0 ml-auto sm:ml-0 cursor-pointer"
                    title="Remove Invitee"
                  >
                    <HiTrash size={16} />
                  </button>
                )}
              </div>
            </li>
          );
        })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ParticipantList;
