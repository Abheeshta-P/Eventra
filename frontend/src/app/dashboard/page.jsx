"use client"
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux'

function page() {
  const {userType} = useSelector(state => state.auth);
  const router = useRouter();
  return userType === 'eventCreator'?router.push('/dashboard/event-creator'):router.push('/dashboard/service-provider')
}

export default page