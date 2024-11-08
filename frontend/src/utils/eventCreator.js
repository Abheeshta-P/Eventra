import { url } from "@/conf";
const eventCreatorService = {
  getServicesCategory : async (category)=>{
    try {
      const response = await fetch(`${url}/api/eventCreator/${category}`, {
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
      console.error('Error fetching current user:', error);
      return null; 
    }
  }
}
export default eventCreatorService;
