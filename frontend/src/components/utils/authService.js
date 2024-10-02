const authService = {
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/current-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include token here, e.g., 'Authorization': 'Bearer token'
        },
      });

      if (response.ok) {
        const data = await response.json();
        return [data.userData,data.userType]; // Return user data if the request was successful
      } else {
        return null; // Return null if the user is not authenticated
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null; // Return null if an error occurs
    }
  },
  logoutUser : async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return await response.json(); // Assuming the response contains JSON
    } catch (error) {
      console.error("Logout error: ", error);
      throw error; // Re-throw the error for further handling
    }
  }
};

export default authService;
