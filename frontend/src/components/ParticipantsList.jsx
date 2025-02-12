"use client"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import { addParticipant,toggleParticipant,deleteParticipant } from '@/store/features/participantSlice';

function ParticipantList({setHasChanges, isDisabled}) {
  const dispatch = useDispatch();
  const participants = useSelector(state => state.participantsList.participantList);

  const [newParticipant, setNewParticipant] = useState('');
  const [phone, setPhoneNumber] = useState('');

  const handleAdd = () => {
    if (participants.some((p) => p.name === newParticipant || p.phone === phone)) {
      Swal.fire('Error', 'Duplicate participant name or phone number!', 'error');
      return;
    }
    if (newParticipant.trim() && phone.trim()) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        alert("Please enter a valid 10-digit Indian phone number.");
        return; 
      }
      const participantInfo = { id: nanoid(), sno: participants.length + 1, name: newParticipant, phone };
      dispatch(addParticipant(participantInfo));
      setNewParticipant('');
      setPhoneNumber('');
      setHasChanges(true);
    }
    else {
      alert("Enter valid name and phone")
    }
  };
  

  const handleToggle = (id) => {
    dispatch(toggleParticipant({ id }));
    setHasChanges(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteParticipant({ id }));
    setHasChanges(true);
  };

  return (
  <div
    className={`p-4 w-[400px] sm:w-[500px] md:w-[550px] lg:w-[650px] text-nowrap text-xs sm:text-sm md:text-base ${
      isDisabled ? 'opacity-90 pointer-events-none' : ''
    }`}
  >      <ul>
        { participants?.map((participant, index) => (
          <div key={participant.id} className={`flex gap-1 w-full items-center sm:gap-3 p-3 bg-zinc-50 rounded-md shadow-md mb-2 ${participant.completed ? 'blur-[2px]' : ''}`}>
            {/* Checkbox */}
            <input
              type="checkbox"
              className="accent-[#03089a] sm:h-4 sm:w-4"
              checked={participant.completed}
              onChange={() => handleToggle(participant.id)}
            />

            {/* Participant Number */}
            <div className="bg-zinc-200 ml-1 sm:ml-0 text-center px-2 py-1 sm:py-2 sm:px-4 rounded-md font-semibold">
              {index + 1}
            </div>

            {/* Participant Name */}
            <div className="flex-grow py-2 px-4 rounded-md shadow-sm text-zinc-800">
              <p className="font-semibold">{participant.name}</p>
            </div>

            {/* Participant Phone */}
            <div className="flex-grow py-2 px-4 rounded-md shadow-sm text-zinc-800">
              <p className="text-zinc-600">{participant.phone}</p>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(participant.id)}
              className="text-white rounded-md shadow-sm px-2 py-2 bg-red-500 hover:bg-red-600 transition-all"
            >
              Delete
            </button>
          </div>
        ))
      }
      </ul>


      <div className="mt-4 flex items-center gap-3 w-full">
        <input
          type="text"
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          className="border rounded p-2 flex-grow focus:outline-[#03089a] shadow-sm w-36 sm:w-48 h-12"
          placeholder="New Invitee name"
        />
        <input
          type="number"
          value={phone}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) { 
              setPhoneNumber(value);
            }
          }}
          className="border rounded p-2 flex-grow focus:outline-[#03089a] shadow-sm w-36 sm:w-48 h-12"
          placeholder="Phone number"
          />

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-[#03089a] text-white rounded-md shadow-sm hover:bg-[#02087c] transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}


export default ParticipantList;
