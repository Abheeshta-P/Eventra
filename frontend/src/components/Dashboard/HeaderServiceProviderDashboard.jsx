"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link';

function HeaderServiceProviderDashboard() {
  const pathname = usePathname();
  const hasDetails  = pathname.endsWith('/details');
  const hasBookings = pathname.endsWith('/bookings');
  const hasGallery  = pathname.endsWith('/gallery');

  return (
    <header className="flex items-center justify-around text-zinc-800 p-1.5 rounded-xl shadow-xs border border-zinc-300 font-semibold bg-zinc-100 mb-3">
      <Link
        href="/dashboard/service-provider/details"
        className={`transition-colors duration-200 ease-in-out px-4 py-2 rounded-lg ${hasDetails ? 'text-[#03089a] bg-zinc-200/80 font-bold shadow-xs' : 'hover:text-zinc-950 text-zinc-600'}`}
      >
        Profile & Details
      </Link>
      <Link
        href="/dashboard/service-provider/bookings"
        className={`transition-colors duration-200 ease-in-out px-4 py-2 rounded-lg ${hasBookings ? 'text-[#03089a] bg-zinc-200/80 font-bold shadow-xs' : 'hover:text-zinc-950 text-zinc-600'}`}
      >
        Bookings & Requests
      </Link>
      <Link
        href="/dashboard/service-provider/gallery"
        className={`transition-colors duration-200 ease-in-out px-4 py-2 rounded-lg ${hasGallery ? 'text-[#03089a] bg-zinc-200/80 font-bold shadow-xs' : 'hover:text-zinc-950 text-zinc-600'}`}
      >
        Portfolio Gallery
      </Link>
    </header>
  );
}

export default HeaderServiceProviderDashboard;
