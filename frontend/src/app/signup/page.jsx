import { Card, Container } from '@/components'
import React from 'react'

function SignupUserTypeSelection() {
  return (
    <Container className={'flex justify-center items-center flex-col'}>
      <h1 className={'mb-14 text-3xl md:text-4xl text-zinc-900 font-semibold'}>Select your role</h1>
      <div className={'flex w-full flex-col md:flex-row gap-16 justify-center items-center'}>
      <Card title={'Event creator'} description={'The one who wants to manage events by using services of platform'} photo={'../../../cardImages/event-creator.png'}/>
      <Card title={'Service provider'} description={'The one who provides services to event creators through our platform'} photo={'../../../cardImages/service-provider.webp'}/>
      </div>
    </Container>
  )
}

export default SignupUserTypeSelection