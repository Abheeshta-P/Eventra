"use client"
import { DashboardLayout, DetailedEventDisplayer, Loading, Container } from '@/components'
import { eventCreatorService } from '@/utils'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// displayed on submit
function SubmitEvent() {
  // batch api call to get event details also set services heree
  const event = useSelector(state => state.eventDetails);
  // use this array of emails to fetch the services batch
  const emails = event?.selectedCategories?.map(category => category.serviceEmail) || [];

  const [servicesDetails, setServicesDetails] = useState([]);
  const router = useRouter()

  useEffect(()=>{
    async function fetchServiceDetails(emails) {
      try {
        const services = await eventCreatorService.getServicesBatch(JSON.stringify(emails));
        if (services) {
          setServicesDetails(services);
        } 
        else if( services.status === 401 || services.status === 403){
          router.replace('/login')
        }
      } catch (error) {
        console.error("Error fetching batch service details:: frontend :: submit event", error);
        return (
          <DashboardLayout>
            <Container className="mb-5">
              <div className="flex flex-col items-center justify-center text-red-600">
                <h2 className="text-2xl font-semibold">Error</h2>
                <p>{error.message || 'Failed to load service details.'}</p>
              </div>
            </Container>
          </DashboardLayout>
        );
      }
    }
    if (emails.length > 0) {
      fetchServiceDetails(emails);
    } 
  },[])

  return servicesDetails.length!=0?(
   <DashboardLayout> <DetailedEventDisplayer event={event} servicesAPI={servicesDetails} isCreating/></DashboardLayout>
  ):<Loading/>
}

export default SubmitEvent