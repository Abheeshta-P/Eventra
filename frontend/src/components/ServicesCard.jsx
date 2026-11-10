import React from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineTag } from 'react-icons/hi';

function ServicesCard({ service, onCreatorAction, ...props }) {
  const statusConfig = service?.status ? {
    pending: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', label: 'Pending Response' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Confirmed' },
    completion_requested: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', label: 'Delivery Acknowledgment Needed' },
    declined: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Declined' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', label: 'Completed' }
  }[service.status] : null;

  return (
    <div className="bg-zinc-50 shadow-md rounded-lg p-6 w-[340px] lg:w-[400px] hover:shadow-lg transition-shadow duration-300 border border-black/20 relative flex flex-col justify-between" {...props}>
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-bold text-zinc-900 text-lg md:text-xl">{service?.name}</h2>
          {statusConfig && (
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
              {statusConfig.label}
            </span>
          )}
        </div>
        
        <div className="flex items-center mb-3">
          <HiOutlineTag className="text-[#03089a] mr-2" size={20} />
          <p className="text-zinc-800 font-medium text-base">{service?.category}</p>
        </div>

        <div className="flex items-center mb-3">
          <p className="text-base md:text-lg font-semibold text-green-800"><span className='mr-4'>₹</span>{service?.cost}</p>
        </div>

        <div className="flex items-center mb-2">
          <HiOutlineMail className="text-[#03089a] mr-2" size={20} />
          <p className="text-zinc-800 text-base break-all">{service?.email}</p>
        </div>

        <div className="flex items-center mb-2">
          <HiOutlinePhone className="text-[#03089a] mr-2" size={20} />
          <p className="text-zinc-800 text-base">{service?.phone}</p>
        </div>

        {service?.location && (
          <div className="flex items-center">
            <HiOutlineLocationMarker className="text-[#03089a] mr-2 shrink-0" size={20} />
            <p className="text-zinc-800 text-base truncate">{service?.location}</p>
          </div>
        )}
      </div>

      {onCreatorAction && (
        <div className="pt-3 mt-3 border-t border-zinc-200">
          {service?.status === 'completion_requested' && (
            <div className="flex gap-2">
              <button
                onClick={() => onCreatorAction(service._id, service.name, 'completed')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition shadow-sm"
              >
                Confirm & Settle
              </button>
              <button
                onClick={() => onCreatorAction(service._id, service.name, 'confirmed')}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs py-2 px-3 rounded-lg transition"
              >
                Not Yet
              </button>
            </div>
          )}
          {service?.status === 'confirmed' && (
            <button
              onClick={() => onCreatorAction(service._id, service.name, 'completed')}
              className="w-full bg-[#03089a] hover:bg-blue-900 text-white text-xs font-semibold py-2 px-3 rounded-lg transition"
            >
              Mark Delivered & Settle Offline Payment
            </button>
          )}
          {service?.status === 'completed' && (
            <div className="text-center text-xs font-bold text-green-700 bg-green-50 py-1.5 rounded-lg border border-green-200">
              Service Completed & Settled
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export default ServicesCard;

