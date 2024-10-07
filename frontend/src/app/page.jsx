//Home
"use client"

import React, { useState } from 'react'
import '../global.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '@/components/utils';
import { ProviderDashboard,CreatorDashboard,HomePage, Loading } from '@/components';
import { login, logout } from '../store/features/authSlice';  

function app() {
   // at first when app loads get the user status
   const dispatch = useDispatch();
   const {userType,isLoggedIn} = useSelector(state => state.auth);
   const [loading,setLoading] = useState(false);
   // when app loads useEffect is invoked
  //  useEffect (()=>{
  //    // check whether there is any logged in user
  //    authService.getCurrentUser().then(([userData, userType])  =>{
  //      // if userAccount is there show the logged in ui
  //      if (userData && userType){
  //        dispatch(login({userData,userType}));
  //      }
  //      else {
  //        dispatch(logout());
  //      }
  //    }). catch( error=>{
  //      console.log("page.jsx useEffect and getCurrentUser :: error",error);
  //    }).finally(()=>setLoading(false));
    
  //  },[])

   const ConditionalRender = ()=>{
    // if logged in directly render dashboard
    if(isLoggedIn){
      if(userType === 'eventCreator')
        return <CreatorDashboard/>
      else if(userType === 'serviceProvider')
       return <ProviderDashboard/>
    }

    // else render home page
    else 
   return <HomePage/>
    
   }
 
 
  return loading?<Loading className={'sm:-mt-16'}/>:<ConditionalRender/>;
}

export default app