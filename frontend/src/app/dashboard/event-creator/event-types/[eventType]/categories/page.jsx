"use client"; 
import React, { useEffect, useState } from "react";
import { eventCategories } from "@/constants";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Container, Card } from "@/components";
// import { resetEventDetails } from "@/store/features/eventDetailsSlice";
import Link from "next/link"; 
import { imageSources } from "@/constants";

// event category per event type
function CategoryInEventType({ params }) {
  const { eventType } = params;
  const categories = eventCategories[eventType]; // Access the correct categories array
  const router = useRouter();
  // const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true); // Track unsaved changes
  const dispatch = useDispatch();

  const handleCategoryClick = (category) => {
    router.push(`/dashboard/event-creator/event-types/${eventType}/categories/${category}/services`);
  };

  if (!categories) {
    console.log("No categories found for this event type");
    return <div>No categories available for this event type.</div>;
  }

  return (
    <Container className={'flex flex-col justify-center items-center'}>
      <h1 className={'mb-10 text-2xl md:text-3xl lg:text-4xl text-zinc-900 font-semibold'}>
        Categories for {eventType}
      </h1>
      <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center w-full'}>
        {categories.map((category) => (
          <Link key={category} href={`/dashboard/event-creator/event-types/${eventType}/categories/${category}/services`} onClick={handleCategoryClick}>
            <Card title={category} description={`Includes various services related to ${category}`} photo={`${imageSources[category]}`} descriptionClass='lg:text-base'/>
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default CategoryInEventType;
