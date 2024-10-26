"use client"
import React from 'react';
import { useSelector } from 'react-redux';

const ProfileSection = ({ children }) => {
  const {userData,userType}= useSelector(state => state.auth);
  const userNameFirstLetter = userData?.name?.charAt(0).toUpperCase() || 'U'; 
  return (
  
      <div className="flex flex-col md:flex-row items-center justify-evenly w-full h-full bg-zinc-200 py-4 mb-6 md:mb-12 md:-mt-9">
      <div
      className='text-5xl md:text-9xl rounded-full w-28 h-28 md:w-56 md:h-56 flex items-center justify-center text-white font-semibold cursor-pointer transition-all duration-200 bg-[#03089a]'
    >
      {userNameFirstLetter}
    </div>
        <div className='mt-8 md:mt-0 flex flex-col  items-center md:items-start gap-1'>
          <h2 className="text-xl md:text-2xl font-bold text-zinc-950">{userData?.name}</h2>
          <p className="text-zinc-600">{userType}</p>
          <p className="text-zinc-700">{userData?.email}</p>
        {children} 
        </div>
      </div>

  );
};

export default ProfileSection;
