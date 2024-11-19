import { url } from "@/conf";
const serviceProviderService = {
  updateServiceDetails : async (details)=>{
    try {
      const response = await fetch(`${url}/api/serviceProvider/update/serviceDetails`, {
        method: 'PATCH',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
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
  }
}

export default serviceProviderService;