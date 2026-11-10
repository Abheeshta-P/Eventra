import React from 'react';
import { Container } from '..';
import { features } from '@/constants';
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiClipboardList, 
  HiMail, 
  HiBell, 
  HiOfficeBuilding 
} from 'react-icons/hi';

const iconMap = {
  calendar: HiCalendar,
  location: HiLocationMarker,
  clipboard: HiClipboardList,
  mail: HiMail,
  bell: HiBell,
  office: HiOfficeBuilding
};

const BentoGrid = () => {
  return (
    <Container className={'min-h-screen sm:min-h-full'}>
      <section className="bento-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {features.map((feature) => {
          const IconComponent = iconMap[feature.iconKey] || HiCalendar;
          return (
            <div
              key={feature.title}
              className="border border-zinc-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-zinc-100"
            >
              <div className="icon text-[#03089a] mb-4">
                <IconComponent size={32} />
              </div>
              <h3 className="title font-bold text-base md:text-lg mb-2 text-[#03089a]">{feature.title}</h3>
              <p className="description text-zinc-600 text-sm md:text-base">{feature.description}</p>
            </div>
          );
        })}
      </section>
    </Container>
  );
};

export default BentoGrid;
