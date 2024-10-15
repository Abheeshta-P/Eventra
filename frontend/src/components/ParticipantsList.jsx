"use client"
import React, { useState } from 'react';

function ParticipantList({ participants=[], onAddParticipant }) {
  const [newParticipant, setNewParticipant] = useState('');
  const [phone, setPhoneNumber] = useState('')

  const handleAdd = () => {
    if (newParticipant.trim()) {
      onAddParticipant(newParticipant,phone);
      setNewParticipant('');
      setPhoneNumber('');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <ul>
        {participants?.map((participant,index) => (
          <div className='flex gap-2'>
            <input type="checkbox" className="accent-[#03089a]" name="" id="" />
          <li key={participant.sno} className="mb-2 border rounded p-2 mr-2 bg-white w-[180px]">{index+1}</li>
          <li key={participant.name} className="mb-2 border rounded p-2 mr-2 bg-white w-[180px]">{participant.name}</li>
          <li key={participant.phone} className="mb-2 border rounded p-2 mr-2 bg-white w-[180px]">{participant.phone}</li>
          </div>
        ))}
      </ul>
      <div className="mt-2">
        <input
          type="text"
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          className="border rounded p-2 mr-2 focus:outline-[#03089a]"
          placeholder="Add new participant"
        />
        <input
          type="number"
          value={phone}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border rounded p-2 mr-2 focus:outline-[#03089a]"
          placeholder="Add phone number"
        />
        <button onClick={handleAdd} className="px-4 py-2 bg-[#03089a] text-white rounded">Add</button>
      </div>
    </div>
  );
}

export default ParticipantList;
