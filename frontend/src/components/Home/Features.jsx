import React from 'react';
import { Container } from '..';
import { features } from '@/constants';

const BentoGrid = () => {
  return (
 <Container><section className="bento-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:-mt-24 md:mt-0">
 {features.map((feature) => (
   <div
     key={feature.title}
     className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow bg-zinc-50 "
   >
     <div className="icon text-2xl md:text-4xl mb-4">{feature.icon}</div>
     <h3 className="title font-semibold text-base md:text-lg mb-2 text-[#03089a]">{feature.title}</h3>
     <p className="description text-zinc-600 text-sm md:text-base">{feature.description}</p>
   </div>
 ))}
</section>
</Container>
  );
};

export default BentoGrid;
