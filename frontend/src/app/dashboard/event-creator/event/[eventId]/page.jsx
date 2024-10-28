import { DashboardLayout, DetailedEventDisplayer } from '@/components'
import React from 'react'
function EventDetails({params}) {
  // apii call pass 
  // pass evnt id in body of the request in backend search based on that event id
  // return the event either store it some where or just call agin on refresh
  // send participant list to partiipationList slice
  const {eventId} = params;
  {/* EventDetails full details with edit options  */}
  return (

    <DashboardLayout>
      <DetailedEventDisplayer event={'api call event object'} eventName={'Jane wedding'} eventType={'wedding'} date={'oct-2'} location={'Manglore'}/>
    </DashboardLayout>

  )
}
export default EventDetails