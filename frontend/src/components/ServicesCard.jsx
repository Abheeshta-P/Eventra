import React from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineTag } from 'react-icons/hi';

function ServicesCard({ service, onCreatorAction, ...props }) {
  const statusConfig = service?.status ? {
    pending: { bg: 'bg-zinc-200', text: 'text-zinc-700', border: 'border-zinc-300', label: 'Requested' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Booked' },
    completion_requested: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', label: 'Unsettled' },
    declined: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Declined' },
    completed: { bg: 'bg-zinc-200', text: 'text-zinc-700', border: 'border-zinc-300', label: 'Settled' }
  }[service.status] : null;

  return (
    <div className="bg-zinc-50 shadow-md rounded-lg p-6 w-full max-w-[340px] lg:max-w-[400px] min-w-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-black/20 relative flex flex-col justify-between" {...props}>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
          <h2 className="font-bold text-zinc-900 text-lg md:text-xl break-words [overflow-wrap:anywhere] min-w-0 flex-1">{service?.name}</h2>
          {statusConfig && (
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border shrink-0 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
              {statusConfig.label}
            </span>
          )}
        </div>
        
        <div className="flex items-center mb-3 min-w-0">
          <HiOutlineTag className="text-[#03089a] mr-2 shrink-0" size={20} />
          <p className="text-zinc-800 font-medium text-base break-words [overflow-wrap:anywhere] min-w-0">{service?.category}</p>
        </div>

        <div className="flex items-center mb-3 min-w-0">
          <p className="text-base md:text-lg font-semibold text-green-800 break-words [overflow-wrap:anywhere] min-w-0"><span className='mr-4'>₹</span>{service?.cost}</p>
        </div>

        <div className="flex items-center mb-2 min-w-0">
          <HiOutlineMail className="text-[#03089a] mr-2 shrink-0" size={20} />
          <p className="text-zinc-800 text-base break-all min-w-0 flex-1">{service?.email}</p>
        </div>

        <div className="flex items-center mb-2 min-w-0">
          <HiOutlinePhone className="text-[#03089a] mr-2 shrink-0" size={20} />
          <p className="text-zinc-800 text-base break-all min-w-0 flex-1">{service?.phone}</p>
        </div>

        {service?.location && (
          <div className="flex items-center min-w-0">
            <HiOutlineLocationMarker className="text-[#03089a] mr-2 shrink-0" size={20} />
            <p className="text-zinc-800 text-base truncate min-w-0 flex-1" title={service?.location}>{service?.location}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicesCard;

