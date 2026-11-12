"use client"
import { usePathname } from 'next/navigation'
import React, { useEffect,useState } from 'react'
import { useDispatch } from 'react-redux';
import { Footer,Header, Loading } from '.';
import { authService } from '../utils';
import { login } from '@/store/features/authSlice';
import { setEvents } from '@/store/features/eventsSlice';

// at first when app loads get the user status
function LayoutRender({children}) {
  const pathName = usePathname();
  const isStandalone = pathName?.includes('/login') || pathName?.includes('/signup') || pathName?.includes('/rsvp');
  const isProtected = pathName?.startsWith('/dashboard');
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
        // Unauthenticated visitor (expected on public pages)
      } finally {
        setLoading(false); 
      }
    }
  
    fetchCurrentUser();
  
    return () => {
      isFetching = false; 
    };
  }, [dispatch]);

  // Only block the screen if visiting a protected dashboard route
  if (loading && isProtected) return <Loading/>;
  
  return isStandalone ? (
    children
  ) : (
    <>
      <Header/>
      <div className='mt-20'>
        {children}
      </div>
      <Footer/>
    </>
  );
}

export default LayoutRender