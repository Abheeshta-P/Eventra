"use client"
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Loading } from '..';

const DashboardLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const {isLoggedIn,userType} = useSelector(state=>state.auth);
  const pathname = usePathname();
  useEffect(() => {
    const checkAuth = async () => {
      setAuthenticated(isLoggedIn);
      setLoading(false);

      if (!isLoggedIn) {
        router.push('/login'); 
        return;
      }

      if(userType === 'eventCreator' && !pathname.includes('event-creator')){
        alert("You are not service provider");
        router.replace('/');
        return;
      }
      if(userType === 'serviceProvider' && !pathname.includes('service-provider')){
        alert("You are not event creator");
        router.replace('/');
        return;
      }
    };

    checkAuth();
  }, [router, isLoggedIn, userType, pathname]);

  if (loading) {
    return <Loading/>; 
  }

  return (
    <div>
      {authenticated ? (
        <>
          {children}
        </>
      ) : (
        <Loading/>
      )}
    </div>
  );
};

export default DashboardLayout;
