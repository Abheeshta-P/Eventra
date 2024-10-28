"use client"
import { DashboardLayout, DetailedEventDisplayer } from '@/components'
import React from 'react'
import { useSelector } from 'react-redux'

function SubmitEvent() {
  // displayed on submit
  // batch api call to get event details also set services heree
  const event = useSelector(state => state.eventDetails);

  return (
   <DashboardLayout> <DetailedEventDisplayer event={event} eventName={event.eventName} eventType={event.eventType} date={event.date} location={event.location} isCreating/></DashboardLayout>
  )
}

export default SubmitEvent