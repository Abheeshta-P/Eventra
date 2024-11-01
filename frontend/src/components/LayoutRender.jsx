"use client"
import { usePathname } from 'next/navigation'
import React, { useEffect,useState } from 'react'
import { useDispatch } from 'react-redux';
import { Footer,Header, Loading } from '.';
import { authService } from './utils';
import { login } from '@/store/features/authSlice';
import { setEvents } from '@/store/features/eventsSlice';

// at first when app loads get the user status
function LayoutRender({children}) {
  const pathName = usePathname();
  const loginOrSignup = pathName.includes('/login')|| pathName.includes('/signup');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isFetching = true;
  
    async function fetchCurrentUser() {
      try {
        const response = await authService.getCurrentUser();
        if (response && response.userType) {
          const { userType, userData, events } = response;
          dispatch(login({ userType, userData }));
          if (userType === 'eventCreator') {
            dispatch(setEvents(events));
          }
          setLoading(false); 
          isFetching = false; 
        } else {
          throw new Error('No valid response');
        }
      } catch (error) {
        console.error("Retrying to fetch user data due to error: not logged in", error);
        // if (isFetching) {
        //   setTimeout(fetchCurrentUser, 3000); 
        // }
      }finally{
        setLoading(false); 
      }
    }
  
    fetchCurrentUser();
  
    return () => {
      isFetching = false; 
    };
  }, [dispatch]);

  if(loading) return <Loading/>;
  
  return loginOrSignup?(
    children
  ):(
    <>
    <Header/>
    <div className='mt-20'>
    {children}
    </div>
    <Footer/>
    </>
  )
}

export default LayoutRender