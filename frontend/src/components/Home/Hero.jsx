import React from 'react'
import { Container,Button } from '..'
import Link from 'next/link'

function Hero() {
  return (
    <Container className={'px-7'}><section className='flex flex-col sm:flex-row justify-evenly w-full min-h-screen items-center sm:-mt-16'>
    <div className='flex flex-col gap-6 w-[400px] lg:w-[600px]'>
      <h1 className='text-[#03089a] text-3xl md:text-4xl font-bold lg:text-5xl'>Plan with Ease, Celebrate with Joy!</h1>
      <h2 className='text-zinc-800 text-sm md:text-base max-w-72 lg:max-w-96'>From weddings to parties, find everything you need to create an unforgettable event.</h2>
      <div className='flex gap-2 md:gap-3'>
        <Link href={'/create-event'}><Button>Plan Your Event</Button></Link>
        <Link href={'list-service'}><Button bgColor='bg-zinc-200' textColor='text-zinc-900'>List Your Service</Button></Link>
      </div>
    </div>
    <div>
      <img src="../../../hero2.png" alt="" className='w-[300px] md:w-[350px] lg:w-[450px]' style={{pointerEvents:'none'}}/>
    </div>
  </section></Container>
  )
}

export default Hero