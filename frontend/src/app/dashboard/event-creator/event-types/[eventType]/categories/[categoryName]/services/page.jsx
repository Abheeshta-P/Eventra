"use client";
import { Container, ServicesCard,Button, DashboardLayout } from '@/components';
import Link from 'next/link';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addCategoryWithService } from '@/store/features/eventDetailsSlice';

function CategoryServices({ params }) {
  const { categoryName, eventType } = params;
  const router = useRouter();
  const dispatch = useDispatch();

  const services = [
    {
      "category": "Decoration",
      "name": "Elegant Wedding Decorators",
      "cost": 40000,
      "email": "info@elegantweddingdecor.com",
      "phone": "9988776655",
      "location": "Downtown",
      "id": 1
    },
    {
      "category": "Decoration",
      "name": "Party Vibes Decor",
      "cost": 35000,
      "email": "contact@partyvibesdecor.com",
      "phone": "9876543211",
      "location": "City Center",
      "id": 2
    },
    {
      "category": "Decoration",
      "name": "Creative Decor Solutions",
      "cost": 45000,
      "email": "hello@creativedecor.com",
      "phone": "9123456780",
      "location": "Uptown",
      "id": 3
    },
    {
      "category": "Decoration",
      "name": "The Grand Decorators",
      "cost": 50000,
      "email": "support@granddecor.com",
      "phone": "9345678901",
      "location": "Lakeside",
      "id": 4
    },
    {
      "category": "Decoration",
      "name": "Luxurious Event Decor",
      "cost": 60000,
      "email": "contact@luxdecor.com",
      "phone": "9234567899",
      "location": "Park Avenue",
      "id": 5
    }
  ];

  const { selectedCategories } = useSelector((state) => state.eventDetails);
  const [selectedCategoriesState, setSelectedCategoriesState] = useState(selectedCategories || []);

  const isSelected = (service) => {
    const selectedCategory = selectedCategoriesState.find((cat) => cat.category === categoryName);
    return selectedCategory && selectedCategory.serviceEmail === service.email;
  };

  const handleSelectServiceClick = (service) => {
    const updatedCategories = selectedCategoriesState.filter((cat) => cat.category !== categoryName);

    updatedCategories.push({ category: categoryName, serviceEmail: service.email });

    setSelectedCategoriesState(updatedCategories);
    dispatch(addCategoryWithService({ category: categoryName, serviceEmail: service.email }));

  };

  const handleViewDetailsClick = (serviceId) => {
    router.push(`/dashboard/event-creator/event-types/${eventType}/categories/${categoryName}/services/${serviceId}`);
  };

  return (
   <DashboardLayout>
     <Container className={'flex flex-col justify-center items-center'}>
      <h1 className={'mb-10 text-2xl md:text-3xl lg:text-4xl text-zinc-900 font-semibold'}>
        Services for {categoryName}
      </h1>
      <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center w-full'}>
        {services.map((service) => (
          <div
            key={service.email}
            className={`relative flex flex-col items-center space-y-4 p-4  ${isSelected(service) ? 'border-4 border-green-500 shadow-lg' : ''}`}
          >
            <ServicesCard
              service={service}
            />
            {isSelected(service) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white w-8 h-8 rounded-full bg-green-700 text-center text-2xl font-bold">✓</span>
              </div>
            )}
            <div className="flex space-x-4">
              <Button
                onClick={() => handleViewDetailsClick(service.id)}
              >
                View Details
              </Button>
              <Button
                className={`${
                  isSelected(service) ? 'bg-gray-500' : 'bg-green-700 hover:bg-green-800'
                } `}
                onClick={() => handleSelectServiceClick(service)}
                disabled={isSelected(service)}
              >
                {isSelected(service) ? 'Selected' : 'Select Service'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
   </DashboardLayout>
  );
}

export default CategoryServices;
