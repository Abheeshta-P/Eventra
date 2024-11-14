import React from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineTag } from 'react-icons/hi';

function ServicesCard({ service, ...props }) {
  return (
    <div className="bg-zinc-50 shadow-md rounded-lg p-6 w-[340px] lg:w-[400px] hover:shadow-lg transition-shadow duration-300 border border-black" {...props}>
      <h2 className="font-bold text-zinc-900 mb-2 text-lg md:text-xl">{service?.name}</h2>
      
      <div className="flex items-center mb-3">
        <HiOutlineTag className="text-[#03089a] mr-2" size={20} />
        <p className="text-zinc-800 font-medium text-base">{service?.category}</p>
      </div>

      <div className="flex items-center mb-3">
        <p className="text-base md:text-lg font-semibold text-green-800"><span className='mr-4'>₹</span>{service?.cost}</p>
      </div>

      <div className="flex items-center mb-2">
        <HiOutlineMail className="text-[#03089a] mr-2" size={20} />
        <p className="text-zinc-800 text-base">{service?.email}</p>
      </div>

      <div className="flex items-center mb-2">
        <HiOutlinePhone className="text-[#03089a] mr-2" size={20} />
        <p className="text-zinc-800 text-base">{service?.phone}</p>
      </div>

     {
      service?.category==='Venue' ?  <div className="flex items-center">
      <HiOutlineLocationMarker className="text-[#03089a]  mr-2" size={20} />
      <p className="text-zinc-800 text-base">{service?.location}</p>
    </div> : null
     }
    </div>
  );
}

export default ServicesCard;
