import { url } from "@/conf";

export const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  return {};
};

const authService = {
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${url}/api/auth/current-user`, {
        method: 'GET',
        credentials: 'include', 
        headers: {
          ...getAuthHeaders(),
        },
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
    let infoFetch ;
    if(type === 'event-creator'){
      infoFetch = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body
        ,
      }
    }
    else if(type === 'service-provider'){
      infoFetch = {
        method: 'POST',
        body,
      }
    }
    try {
      const response = await fetch(`${url}/api/auth/signup/${type}`, infoFetch);

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
  
      if (response) {
        if (response.ok || response.status === 401) {
          const data = await response.json();
          if (data && data.token && typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
          }
          return data;
        } else {
          return null;
        }
      } else {
        console.error('No response received');
        return null;
      }
    } catch (error) {
      console.error('Error in loginUser:', error);
      return null;
    }
  },
  logoutUser : async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      const response = await fetch(`${url}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
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
  },
};

export default authService;
