import { url } from "@/conf";
const authService = {
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${url}/api/auth/current-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; 
      } else {
        return null; 
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null; 
    }
  },
  
  signUpUser: async (body,type) => {
    try {
      const response = await fetch(`${url}/api/auth/signup/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body
        ,
      });

      if (response.ok || response.status === 400) {
        return response;
      } 
      else {
        return null; // Return null if the user is not authenticated
      }
    } catch (error) {
      console.error('Error : signUpUser', error);
      return null; // Return null if an error occurs
    }
  },
  loginUser: async (body) => {
    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        credentials: 'include', 
      });
  
      // Ensure response is not null
      if (response) {
        // If the response status is OK (200) or 400 (for bad request errors)
        if (response.ok || response.status===401) {
          const data = await response.json(); // Parse the response JSON
          return data; // Return the parsed data
        } else {
          return null; // Return null if the response is neither OK nor a bad request
        }
      } else {
        console.error('No response received');
        return null;
      }
    } catch (error) {
      console.error('Error in loginUser:', error);
      return null; // Return null in case of an error
    }
  },
  logoutUser : async () => {
    try {
      const response = await fetch(`${url}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials : 'include'
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response; 
    } catch (error) {
      console.error("Logout error: ", error);
      throw error; 
    }
  }
};

export default authService;
