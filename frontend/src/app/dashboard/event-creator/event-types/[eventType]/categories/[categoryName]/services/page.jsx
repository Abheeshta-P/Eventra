"use client";
import { Container, ServicesCard,Button, DashboardLayout, Loading } from '@/components';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addCategoryWithService, removeServiceWithCategory } from '@/store/features/eventDetailsSlice';
import { eventCreatorService } from '@/utils';

function CategoryServices({ params }) {
  const { categoryName, eventType } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const { location } = useSelector(state => state.eventDetails);
  const [services,setServices] = useState([]);
  const [loading,setLoading] =useState(false);


  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const services = await eventCreatorService.getServicesCategory(categoryName,location);
        if (services.status === 403 || services.status === 401) {
          router.push('/login'); 
          return;
        }
  
        if (services) {
          setServices(services);
        } else {
          alert("No services found for this category.");
        }
      } catch (error) {
        console.error("Error fetching services :: serviceCategory Display :: frontend", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchServices();
  }, [categoryName, router,location]);
  
  const { selectedCategories } = useSelector((state) => state.eventDetails);
  const [selectedCategoriesState, setSelectedCategoriesState] = useState(selectedCategories || []);

  const isSelected = (service) => {
    const selectedCategory = selectedCategoriesState.find((cat) => cat.category === categoryName);
    return selectedCategory && selectedCategory.serviceEmail === service.email;
  };

  const handleSelectServiceClick = (service) => {
    const isServiceSelected = selectedCategoriesState.some(
      (cat) => cat.category === categoryName && cat.serviceEmail === service.email
    );
  
    let updatedCategories;
    if (isServiceSelected) {
      updatedCategories = selectedCategoriesState.filter(
        (cat) => !(cat.category === categoryName && cat.serviceEmail === service.email)
      );
      dispatch(removeServiceWithCategory({ category: categoryName }));
    } else {
      updatedCategories = [
        ...selectedCategoriesState.filter((cat) => cat.category !== categoryName),
        { category: categoryName, serviceEmail: service.email },
      ];
      dispatch(addCategoryWithService({ category: categoryName, serviceEmail: service.email }));
    }
    setSelectedCategoriesState(updatedCategories);
  };
  

  const handleViewDetailsClick = (serviceId) => {
    router.push(`/dashboard/event-creator/event-types/${eventType}/categories/${categoryName}/services/${serviceId}`);
  };

  if(loading) return <div className="flex justify-center items-center w-full h-full"><Loading/></div>
  
  const fallbackMessage = categoryName === "Venue" ? `We couldn&apos;t find any ${categoryName} services in ${location} at the moment. Please check back later!`
    : `We couldn&apos;t find any services for ${categoryName} at the moment. Please check back later!`;


  return (
   <DashboardLayout>
   <Container className="flex flex-col justify-center items-center">
    <h1 className="mb-10 text-2xl md:text-3xl lg:text-4xl text-zinc-900 font-semibold">
      Services for {categoryName}
    </h1>

    {services && services.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center w-full">
        {services.map((service) => (
          <div
            key={service.email}
            className={`relative flex flex-col items-center space-y-4 p-4 ${isSelected(service) ? 'border-4 border-green-500 shadow-lg' : ''}`}
          >
            <ServicesCard service={service} />

            {isSelected(service) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white w-8 h-8 rounded-full bg-green-700 text-center text-2xl font-bold">✓</span>
              </div>
            )}

            <div className="flex space-x-4 z-10">
              <Button onClick={() => handleViewDetailsClick(service._id)}>
                View Details
              </Button>
              <Button
                className={`${isSelected(service) ? 'bg-red-600 hover:bg-red-700' : 'bg-green-700 hover:bg-green-800'}`}
                onClick={() => handleSelectServiceClick(service)}
              >
                {isSelected(service) ? 'Unselect Service' : 'Select Service'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    ) : <div className="text-zinc-700 font-semibold text-lg md:text-xl lg:text-2xl text-center w-full">
    {fallbackMessage}
    </div>
    }
  </Container>


   </DashboardLayout>
  );
}

export default CategoryServices;
