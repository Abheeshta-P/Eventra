'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Loading } from '..';

const DashboardLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isLoggedIn, userType } = useSelector((state) => state.auth);
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login'); 
      return;
    }

    if (userType === 'eventCreator' && !pathname.includes('event-creator')) {
      router.replace('/dashboard/event-creator');
      return;
    }

    if (userType === 'serviceProvider' && !pathname.includes('service-provider')) {
      router.replace('/dashboard/service-provider/details');
      return;
    }

    setLoading(false);
  }, [router, isLoggedIn, userType, pathname]);

  if (loading) {
    return <Loading />;
  }

  return <div>{children}</div>;
};

export default DashboardLayout;
