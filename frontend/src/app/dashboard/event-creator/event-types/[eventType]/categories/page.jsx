"use client"; 
import React, { useEffect, useState } from "react";
import { eventCategories } from "@/constants";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Container, Card,Button, DashboardLayout } from "@/components";
// import { resetEventDetails } from "@/store/features/eventDetailsSlice";
import Link from "next/link"; 
import { eventCategoryImageSources } from "@/constants";
import { HiCheck } from "react-icons/hi";

function CategoryInEventType({ params }) {
  const { eventType } = params;
  const categories = eventCategories[eventType];
  const router = useRouter();
  const { selectedCategories } = useSelector(state => state.eventDetails);
  const selectedCategoriesState = selectedCategories || [];

  const handleGotoSummaryPage = () => {
    if (selectedCategories?.length > 0) {
      router.push('/dashboard/event-creator/submit-event');
    } else {
      alert("Add at least one service of a category to proceed.");
      return;
    }
  };

  if (!categories) {
    return (
      <DashboardLayout>
        <Container className="text-center py-12">
          <p className="text-xl text-zinc-700">No categories available for this event type.</p>
        </Container>
      </DashboardLayout>
    );
  }

  return (
   <DashboardLayout> 
    <Container className={'flex flex-col justify-center items-center'}>
   <h1 className={'mb-10 text-2xl md:text-3xl lg:text-4xl text-zinc-900 font-semibold'}>
     Categories for {eventType}
   </h1>
   <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center w-full'}>
     {categories.map((category) => {
      const isSelected = selectedCategoriesState.some(cat => cat.category === category);  
       
       return (
         <Link 
           key={category} 
           href={`/dashboard/event-creator/event-types/${eventType}/categories/${category}/services`}
           className="relative hover:scale-[1.02] transition-transform"
         >
           <Card 
             key={category}
             title={category} 
             description={`Browse and select services for ${category}`} 
             photo={`${eventCategoryImageSources[category] || ''}`} 
             className={`lg:text-base ${isSelected ? 'border-4 border-green-500 shadow-lg' : ''}`} 
           />
           {isSelected && (
             <div className="absolute inset-0 flex items-center justify-center bg-green-50/20 rounded-lg">
               <span className="text-white w-10 h-10 rounded-full bg-green-700 flex items-center justify-center shadow-lg">
                 <HiCheck size={24} />
               </span> 
             </div>
           )}
         </Link>
       );
     })}
   </div>
 <Button className="my-12 font-bold px-8 py-3 bg-[#03089a]" onClick={handleGotoSummaryPage}>
   Go to Event Summary Page
 </Button>
 </Container>
 </DashboardLayout>
  );
}


export default CategoryInEventType;
