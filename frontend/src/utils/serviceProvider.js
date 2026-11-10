import { url } from "@/conf";
import { getAuthHeaders } from "./authService";

const serviceProviderService = {
  updateServiceDetails : async (details)=>{
    try {
      const response = await fetch(`${url}/api/serviceProvider/update/serviceDetails`, {
        method: 'PATCH',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body : details
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
      console.error('Error updating service details :', error);
      return null; 
    }
  },
  getGalleryImages : async ()=>{
    try {
      const response = await fetch(`${url}/api/serviceProvider/getGalleryImages`, {
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
      console.error('Error fetching gallery images :', error);
      return null; 
    }
  },
  updateServiceGalleryImages : async (body,email)=>{
    try {
      const response = await fetch(`${url}/api/serviceProvider/updateGalleryImages?email=${encodeURIComponent(email)}`, {
        method: 'PATCH',
        credentials : "include",
        headers: {
          ...getAuthHeaders(),
        },
        body,
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
      console.error('Error updating gallery images :', error);
      return null; 
    }
  },
  getBookings: async () => {
    try {
      const response = await fetch(`${url}/api/serviceProvider/bookings`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.bookings;
      } else if (response.status === 403 || response.status === 401) {
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching provider bookings:', error);
      return null;
    }
  },
  updateBookingStatus: async (eventId, serviceId, status) => {
    try {
      const response = await fetch(`${url}/api/serviceProvider/booking/${eventId}/${serviceId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('Error updating booking status:', response.status, errData);
        return null;
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      return null;
    }
  }
}

export default serviceProviderService;
