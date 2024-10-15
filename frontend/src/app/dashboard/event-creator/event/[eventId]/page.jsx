
import { DetailedEventDisplayer } from '@/components'
import React from 'react'

function EventDetails({
  params: { eventId },
}) {
  // apii call pass 
  return (
    <>
    {/* <div>EventDetails full details with edit options {eventId}</div> */}
    <DetailedEventDisplayer event={'api call event object'} eventName={'Chinmayi wedding'} eventType={'wedding'} date={'oct-2'} location={'mankude'}/>
    </>
  )
}

export default EventDetails