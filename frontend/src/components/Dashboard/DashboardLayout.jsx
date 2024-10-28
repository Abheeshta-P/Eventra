"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Loading } from '..';

const DashboardLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const {isLoggedIn} = useSelector(state=>state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      setAuthenticated(isLoggedIn);
      setLoading(false);

      if (!isLoggedIn) {
        router.push('/login'); 
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <Loading/>; // Show a loading state while checking auth
  }

  return (
    <div>
      {authenticated ? (
        <>
          {/* Render the dashboard content */}
          {children}
        </>
      ) : (
        <Loading/>
      )}
    </div>
  );
};

export default DashboardLayout;
