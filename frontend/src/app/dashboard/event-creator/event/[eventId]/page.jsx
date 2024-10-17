
import { DetailedEventDisplayer } from '@/components'
import React from 'react'

function EventDetails({
  params: { eventId },
}) {
  // apii call pass 
  // pass evnt id in body of the request in backend search based on that event id
  // return the event either store it some where or just call agin on refresh
  // send participant list to partiipationList slice
  return (
    <>
    {/* <div>EventDetails full details with edit options {eventId}</div> */}
    <DetailedEventDisplayer event={'api call event object'} eventName={'Chinmayi wedding'} eventType={'wedding'} date={'oct-2'} location={'mankude'}/>
    </>
  )
}

export default EventDetails