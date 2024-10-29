"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

function ServiceProviderDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/service-provider/details'); 
  }, [router]);

  return null;
}

export default ServiceProviderDashboard;
