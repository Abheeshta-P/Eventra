//Home
"use client"

import React from 'react'
import {  useSelector } from 'react-redux';
import { HomePage } from '@/components';
import { useRouter } from 'next/navigation';

function App() {
   const router = useRouter();
   const {userType,isLoggedIn} = useSelector(state => state.auth);

   const ConditionalRender = ()=>{
    if(isLoggedIn){
      if(userType === 'eventCreator')
        router.push('/dashboard/event-creator')
      else if(userType === 'serviceProvider')
       router.push('/dashboard/service-provider/details')
    }

    else 
   return <HomePage/>
    
   }
 
 
  return <ConditionalRender/>;
}

export default App