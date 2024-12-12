

<h1 align='center'> 🎉 Eventra - Event Management Portal 🎉</h1>

**Eventra** is a comprehensive event management platform that connects users with service providers like caterers, decorators, and venues. Users can create events, manage guest lists, send invitations, and much more—all through a seamless, user-friendly interface.


## 🚀 Features

- **Event Planning**: Create and plan events with ease.  
- **Service Listings**: Find and connect with nearby service providers based on event types.  
- **Guest List Management**: Organize your event guests within the same platform to make everything digital.  
- **Notifications**: Allowed event creators to plan events and receiving a **CSV** of selected services via email. Notifications are sent to service providers when selected by event creators via email.
- **Service Provider Dashboard**: Upload galleries, update details!  


## ⚙️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT  
- **Email**: Nodemailer  
- **Styling**: Tailwind CSS  


## 🛠️ How to Run the Project

### Prerequisites

Ensure you have the following installed:

1. **Node.js** (v16 or higher)  
2. **MongoDB** (local or cloud instance)  
3. **Git**  

### Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/eventra.git
   cd eventra
   ```

2. **Install dependencies for the frontend and backend**  
   ```bash
   # For the backend
   cd backend
   npm install
   ```

   ```bash
   # For the frontend
   cd frontend
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the `backend` folder with the following:  
   ```env
   EMAIL = ''
   PASS = ''
   MONGODB = ''
   JWT_SECRET = ''
   CLOUDINARY_CLOUD_NAME = ''
   CLOUDINARY_API_KEY = ''
   CLOUDINARY_API_SECRET = ''
   ```
    Create a `.env` file in the `frontend` folder with the following:  
   ```env
   NEXT_PUBLIC_API_URL='http://localhost:5000' // port number given in backend
   ```

4. **Run MongoDB**  
   Make sure your MongoDB instance is running.  

5. **Start the backend server**  
   In the `backend` folder:  
   ```bash
   npm start
   ```

6. **Start the frontend server**  
   In the `frontend` folder:  
   ```bash
   npm run dev
   ```

7. **Access the application**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.  


> **Note**: The project is still under development. 
