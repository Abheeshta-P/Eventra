"use client"
import React from 'react'
import { Container } from '..'
import { useSelector } from 'react-redux';


function CreatorDashboard() {
  const {userData}= useSelector(state => state.auth);
  const userNameFirstLetter = userData?.name?.charAt(0).toUpperCase() || 'U'; 
  return (
    <Container className={'flex flex-col items-center md:items-start'}>
      <div
      className='text-5xl md:text-9xl rounded-full w-28 h-28 md:w-56 md:h-56 flex items-center justify-center text-white font-semibold cursor-pointer transition-all duration-200 bg-[#03089a]'
    >
      {userNameFirstLetter}
    </div>
    </Container>
  )
}

export default CreatorDashboard