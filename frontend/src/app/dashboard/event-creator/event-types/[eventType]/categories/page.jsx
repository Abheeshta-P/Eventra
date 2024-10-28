"use client"; 
import React, { useEffect, useState } from "react";
import { eventCategories } from "@/constants";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Container, Card,Button, DashboardLayout } from "@/components";
// import { resetEventDetails } from "@/store/features/eventDetailsSlice";
import Link from "next/link"; 
import { eventCategoryImageSources } from "@/constants";

function CategoryInEventType({ params }) {
  const { eventType } = params;
  const categories = eventCategories[eventType];
  const router = useRouter();
  // const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true); // Track unsaved changes
  const dispatch = useDispatch();
  const {selectedCategories }= useSelector(state => state.eventDetails)
  const [selectedCategoriesState, setSelectedCategories] = useState(selectedCategories || []);


  const handleCategoryClick = (category) => {
    router.push(`/dashboard/event-creator/event-types/${eventType}/categories/${category}/services`);
  };

  if (!categories) {
    console.log("No categories found for this event type");
    return <div>No categories available for this event type.</div>;
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
           onClick={() => handleCategoryClick(category)}
           className="relative"
         >
           <Card 
             title={category} 
             description={`Includes various services related to ${category}`} 
             photo={`${eventCategoryImageSources[category]}`} 
             className={`lg:text-base ${isSelected ? 'border-4 border-green-500 shadow-lg' : ''}`} // Conditionally apply background
           />
           {isSelected && (
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-white w-8 h-8 rounded-full bg-green-700 text-center text-2xl font-bold">✓</span> {/* Checkmark */}
             </div>
           )}
         </Link>
       );
     })}
   </div>
 <Link href={'/dashboard/event-creator/submit-event'}><Button className="my-12">Go to Event Summary Page</Button> </Link>{/* The button you mentioned */}
 </Container>
 </DashboardLayout>
  );
}

export default CategoryInEventType;
