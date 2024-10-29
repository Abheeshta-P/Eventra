"use client"

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux'

function Dashboard() {
  const {userType} = useSelector(state => state.auth);
  const router = useRouter();
  return userType === 'eventCreator'?router.push('/dashboard/event-creator'):router.push('/dashboard/service-provider/details')
}

export default Dashboard;