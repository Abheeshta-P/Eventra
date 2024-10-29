"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link';

function HeaderServiceProviderDashboard() {
  const pathname = usePathname();
  const hasDetails  = pathname.endsWith('/details');
  return (
    <header className="flex items-center justify-evenly text-zinc-800 p-1 rounded-lg shadow-md border border-black/20 font-semibold">
    <Link
      href="/dashboard/service-provider/details"
      className={`transition-colors duration-200 ease-in-out px-4 py-2 rounded-md ${hasDetails?'text-[#03089a] hover:text-[#03089a]':'hover:text-zinc-950 '}`}>
      Details
    </Link>
    <Link
      href="/dashboard/service-provider/gallery"
      className={`  transition-colors duration-200 ease-in-out px-4 py-2 rounded-md ${!hasDetails?'text-[#03089a] hover:text-[#03089a]':'hover:text-zinc-950 '}`}
    >
      Gallery
    </Link>
  </header>
  )
}

export default HeaderServiceProviderDashboard