import { url } from "@/conf";
import { getAuthHeaders } from "./authService";

const eventCreatorService = {
  getServicesCategory : async (category,location)=>{
    try {
      const response = await fetch(`${url}/api/eventCreator/categoryServices/${category}?location=${encodeURIComponent(location || '')}`, {
        method: 'GET',
        credentials: 'include', 
        headers: {
          ...getAuthHeaders(),
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403 || response.status === 401){
        return response;
      } 
      else {
        return null; 
      }
    } catch (error) {
      console.error('Error fetching category services :', error);
      return null; 
    }
  },
  getServiceDetails : async (serviceId)=>{
    try {
      const response = await fetch(`${url}/api/eventCreator/service/${serviceId}`, {
        method: 'GET',
        credentials: 'include', 
        headers: {
          ...getAuthHeaders(),
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403 || response.status === 401){
        return response;
      } 
      else {
        return null; 
      }
    } catch (error) {
      console.error('Error fetching service details :', error);
      return null; 
    }
  },
  getServicesBatch : async (emails)=>{
    try {
      const response = await fetch(`${url}/api/eventCreator/services/batch`, {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json', 
          ...getAuthHeaders(),
        },
        body : emails
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403 || response.status === 401){
        return response;
      } 
      else {
        return null; 
      }
    } catch (error) {
      console.error('Error fetching services details batch :', error);
      return null; 
    }
  },
  createEvent : async (details)=>{
    try {
      const response = await fetch(`${url}/api/eventCreator/event/createEvent`, {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json', 
          ...getAuthHeaders(),
        },
        body: JSON.stringify(details),
      });
  
      if (response.status === 201) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403 || response.status === 401){
        return response;
      } 
      else {
        return null; 
      }
    } catch (error) {
      console.error('Error creating event :', error);
      return null; 
    }
  },
  getEventDetails : async (eventId)=>{
    try {
      const response = await fetch(`${url}/api/eventCreator/event/${eventId}`, {
        method: 'GET',
        credentials: 'include', 
        headers: {
          ...getAuthHeaders(),
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403 || response.status === 401){
        return response;
      } 
      else {
        return null; 
      }
    } catch (error) {
      console.error('Error fetching event details :', error);
      return null; 
    }
  },
  updateEventDetails : async (eventId,updateTodoParticipants)=>{
    try {
      const response = await fetch(`${url}/api/eventCreator/event/updateTodoParticipants/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include', 
        body: JSON.stringify(updateTodoParticipants),
      })


    if (response.ok) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403 || response.status === 401){
        return response;
      } 
      else {
        return null; 
      }
    } catch (error) {
      console.error('Error updating todo and participant details :', error);
      return null; 
    }
  },
  deleteEvents : async (deleteEventIds)=>{
    try {
      const response = await fetch(`${url}/api/eventCreator/event/deleteEvents`, {
        method: 'DELETE',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body : deleteEventIds
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403 || response.status === 401){
        return response;
      } 
      else {
        return null; 
      }
    } catch (error) {
      console.error('Error deleting event details :', error);
      return null; 
    }
  },
  updateServiceStatus: async (eventId, serviceId, status) => {
    try {
      const response = await fetch(`${url}/api/eventCreator/event/${eventId}/service/${serviceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else if (response.status === 403 || response.status === 401) {
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error updating service status by creator:', error);
      return null;
    }
  },
  getPendingRequests: async () => {
    try {
      const response = await fetch(`${url}/api/eventCreator/pending-requests`, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return data.pendingRequests || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching creator pending requests:', error);
      return [];
    }
  },
}
export default eventCreatorService;
