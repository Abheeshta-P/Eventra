"use client"
import React from 'react'
import { Container,Button } from '..'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

function Hero() {
  // handle routing based on current status of user
  const {isLoggedIn,userType} = useSelector(state => state.auth)
  const router = useRouter();
  const PlanEvent = ()=>{
    if(isLoggedIn && userType === 'eventCreator')
      router.push('/dashboard/event-creator/event-types');
    else if(isLoggedIn && userType === 'serviceProvider')
      alert("You are service provider cannot create event!");
    else 
      router.push('/login');
  }
  const ListService = ()=>{
    if(isLoggedIn && userType === 'serviceProvider')
      router.push('/dashboard/service-provider/details');
    else if(isLoggedIn && userType === 'eventCreator')
      alert("You are event creator cannot add a service!");
    else 
      router.push('/login');
  }
  return (
    <Container className={'px-7'}><section className='flex flex-col sm:flex-row justify-evenly w-full min-h-screen items-center sm:-mt-16'>
    <div className='flex flex-col gap-6 w-[400px] lg:w-[600px]'>
      <h1 className='text-[#03089a] text-3xl md:text-4xl font-bold lg:text-5xl'>Plan with Ease, Celebrate with Joy!</h1>
      <h2 className='text-zinc-800 text-sm md:text-base max-w-72 lg:max-w-96'>From weddings to parties, find everything you need to create an unforgettable event.</h2>
      <div className='flex gap-2 md:gap-3'>
        <Button onClick={PlanEvent}>Plan Your Event</Button>
        <Button onClick={ListService} bgColor='bg-zinc-200' textColor='text-zinc-900'>List Your Service</Button>
      </div>
    </div>
    <div>
      <img src="../../../hero.png" alt="" className='w-[300px] md:w-[350px] lg:w-[450px] lg:-mt-8' style={{pointerEvents:'none'}}/>
    </div>
    
  </section>
  </Container>
  )
}

export default Hero