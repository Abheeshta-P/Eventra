

<h1 align='center'> Eventra - Event Management Portal </h1>

**Eventra** is a comprehensive event management platform that connects users with service providers like caterers, decorators, and venues. Users can create events, manage guest lists, send invitations, and much more—all through a seamless, user-friendly interface.


## Features

- **Event Planning**: Create and plan events with ease.  
- **Service Listings**: Find and connect with nearby service providers based on event types.  
- **Guest List Management**: Organize your event guests within the same platform to make everything digital.  
- **Notifications**: Allowed event creators to plan events and receiving a **CSV** of selected services via email. Notifications are sent to service providers when selected by event creators via email.
- **Service Provider Dashboard**: Upload galleries, update details!  


## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT  
- **Email**: Nodemailer  
- **Styling**: Tailwind CSS


## Screenshots

| **Landing page**                         | **Sign Up (Service Provider)**              |
|------------------------------------------|------------------------------------------|
| <img src="https://github.com/user-attachments/assets/6bb88440-4acf-42c3-9bd9-9074df33a8cb" width="500" height="auto">| <img src="https://github.com/user-attachments/assets/ab741b92-b595-4c77-b54c-f08de0b709b0" width="500" height="auto"> |

| **Sign Up (Event Creator)**           | **Login**                                |
|------------------------------------------|------------------------------------------|
| <img src="https://github.com/user-attachments/assets/2b2dce36-b124-4081-8ae0-78233afb6873" width="500" height="auto"> | <img src="https://github.com/user-attachments/assets/7e7456b6-1b94-4549-bc2e-1421d023c616" width="500" height="auto"> |

| **Dashboard (Event Creator)**            | **Dashboard (Service Provider)**         |
|------------------------------------------|------------------------------------------|
| <img src="https://github.com/user-attachments/assets/b5c1f72a-902d-4d15-8f8d-4774c50b7b4b" width="500" height="auto"> | <img src="https://github.com/user-attachments/assets/034d1044-cfb6-4350-8647-aa10fca662c8" width="500" height="auto"> |

| **Email (Event Creator)**            | **Email (Service Provider)**         |
|------------------------------------------|------------------------------------------|
| <img src="https://github.com/user-attachments/assets/6cd5a39c-46a0-4fb2-a535-9103ce8553be" width="500" height="auto"> | <img src="https://github.com/user-attachments/assets/fc859802-2a2c-4f5c-9812-8af167f79485" width="500" height="auto"> |

## How to Run the Project

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


## Eventra 2.0 Features

Eventra 2.0 transforms the portal into a complete end-to-end Event Operating System and Vendor Marketplace:

- **Vendor Booking & Inquiries Hub**: In-app booking management for service providers with real-time status transitions (`Pending`, `Confirmed`, `Declined`, `Completed`).
- **Public Digital RSVP Portal**: Shareable `/rsvp/:eventId` links allowing guests to confirm attendance, headcount (+1s), and dietary requirements in real time.
- **Smart Event Budget Tracker**: Dynamic cost calculator tracking target budget vs. actual booked services, with category-wise expenditure breakdowns.
- **Service Provider Ratings & Verified Reviews**: 5-star rating system with client feedback on service cards and provider profiles.
- **Advanced Discovery & Smart Filtering**: Filter service providers by budget range, location, category, and average ratings with instant keyword search.
- **Event Command Center & Countdown Widget**: Real-time event countdown, checklist completion rates, and an overall event readiness index.
- **Calendar Sync & PDF Export**: Instant "Add to Google Calendar" (.ics export) and downloadable event schedule briefs.


## Contact
Feel free to reach out if you have questions or suggestions!

## License
**All Rights Reserved to Abheeshta-P**

> **Note**: Project is under development for 2.0