//Home
"use client"

import React from 'react'
import '../global.css'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '@/components/utils';

function app() {
   // at first when app loads get the user status
   const dispatch = useDispatch();
 
   // when app loads useEffect is invoked
   useEffect (()=>{
     // check whether there is any logged in user
     authService.getCurrentUser().then(([userData, userType])  =>{
       // if userAccount is there show the logged in ui
       if (userData && userType){
         dispatch(login({userData,userType}));
       }
       else {
         dispatch(logout());
       }
     }). catch( error=>{
       console.log("page.jsx useEffect and getCurrentUser :: error",error);
     })
    
   },[])
 
  return (
   <h1> App</h1>
  )
}

export default app