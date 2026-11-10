"use client";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import serviceProviderService from '@/utils/serviceProvider';

function ServiceProviderDashBoardProfile() {
  const { userData } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const bookings = await serviceProviderService.getBookings();
        if (bookings && Array.isArray(bookings)) {
          const total = bookings.length;
          const pending = bookings.filter((b) => b.status === 'pending').length;
          const confirmed = bookings.filter(
            (b) => b.status === 'confirmed' || b.status === 'completed' || b.status === 'completion_requested'
          ).length;
          const revenue = bookings
            .filter((b) => b.status === 'confirmed' || b.status === 'completed')
            .reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);
          setStats({ total, pending, confirmed, revenue });
        }
      } catch (e) {
        console.error('Error loading provider stats in profile:', e);
      }
    }
    loadStats();
    window.addEventListener('booking-updated', loadStats);
    return () => window.removeEventListener('booking-updated', loadStats);
  }, []);

  const userNameFirstLetter = userData?.name?.charAt(0).toUpperCase() || 'P';

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between w-full bg-zinc-200 p-6 rounded-2xl mb-6 border border-zinc-300/80 shadow-xs gap-6">
      {/* Left: Avatar & SP Details */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="text-4xl sm:text-6xl rounded-full w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-zinc-100 font-bold bg-[#03089a] shadow-sm shrink-0">
          {userNameFirstLetter}
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-zinc-950">
              {userData?.name}
            </h2>
            <span className="text-xs bg-[#03089a]/15 text-[#03089a] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {userData?.category || "Service Provider"}
            </span>
          </div>
          <p className="text-zinc-600 text-sm font-medium">
            {userData?.email} • {userData?.phone}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-1 text-sm text-zinc-700">
            <span>
              Location:{" "}
              <strong className="text-zinc-900">
                {userData?.location || "Pan-India"}
              </strong>
            </span>
            <span>
              Starting Cost:{" "}
              <strong className="text-green-800 font-bold">
                ₹{userData?.cost}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Key Performance Indicators (The Business Agenda!) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto shrink-0">
        <div className="bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wide">
            Total Requests
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            {stats.total}
          </p>
        </div>
        <div className="bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
            Pending Action
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-0.5">
            {stats.pending}
          </p>
        </div>
        <div className="bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
            Confirmed
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-0.5">
            {stats.confirmed}
          </p>
        </div>
        <div className="bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide">
            Estimated Revenue
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#03089a] mt-0.5">
            ₹{stats.revenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServiceProviderDashBoardProfile;
