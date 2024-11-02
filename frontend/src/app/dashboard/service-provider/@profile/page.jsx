"use client"
import { ProfileSection } from '@/components'
import React from 'react'
import { useSelector } from 'react-redux'

function ServiceProviderDashBoardProfile() {
  const {userData} = useSelector(state => state.auth);
  return (
      <ProfileSection>
      <p className="text-zinc-700 text-base">Category : {userData?.category}</p>
      <p className="text-zinc-700 text-base">Location : {userData?.location}</p>
      <p className="text-zinc-700 text-base">Estimated cost : {userData?.cost}</p>
      </ProfileSection>
  )
}

export default ServiceProviderDashBoardProfile