import { url } from "@/conf";
const eventCreatorService = {
  getServicesCategory : async (category)=>{
    try {
      const response = await fetch(`${url}/api/eventCreator/categoryServices/${category}`, {
        method: 'GET',
        credentials: 'include', 
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403){
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
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403){
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
        },
        body : emails
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; 
      } 
      else if (response.status === 403){
        return response;
      } 
      else {
        return null; 
      }
    } catch (error) {
      console.error('Error fetching services details batch :', error);
      return null; 
    }
  }
}
export default eventCreatorService;
