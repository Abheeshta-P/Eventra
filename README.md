<h1 align='center'>Eventra - Digital Event Management & Vendor Marketplace</h1>

<p align="center">
  <strong>The all-in-one Event Operating System: Plan events, discover and book verified vendors, collect digital RSVPs, and manage guest lists seamlessly.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version 2.0.0" />
  <img src="https://img.shields.io/badge/Next.js-14-black.svg" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-Express-green.svg" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-emerald.svg" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-Zinc-zinc.svg" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-All_Rights_Reserved-red.svg" alt="License" />
</p>


## What is Eventra?

**Eventra** simplifies event planning by bringing hosts and service providers together under one unified digital platform. 

Whether you are hosting a wedding, corporate conference, or birthday celebration, Eventra helps you organize every detail: from booking caterers, decorators, and venues, to sending branded digital invitations and tracking guest RSVPs in real time.


## Tech Stack & Architecture

Eventra is built as a decoupled full-stack web application designed for fast page loads, real-time coordination, and scalable state management:

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 14 Client                    │
│   (App Router • Tailwind CSS • Redux Toolkit • Icons)   │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP / REST (JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Express.js Backend API                 │
│  (JWT Auth • Role-based Middleware • Nodemailer Utils) │
└─────────────┬──────────────────────────┬───────────────┘
              │                          │
              ▼                          ▼
     ┌─────────────────┐       ┌──────────────────┐
     │ MongoDB Cluster │       │ Cloudinary Media │
     │  (Mongoose ODM) │       │ (Provider Gallery│
     └─────────────────┘       └──────────────────┘
```

* **Frontend**: Next.js 14 (App Router) with React 18 and Tailwind CSS for responsive styling. Redux Toolkit manages complex client-side state across multi-step event wizards and door check-ins.
* **Backend**: Node.js & Express.js with ES Modules. Routes are segmented into public unauthenticated portals (RSVP), role-protected event creator routes, and service provider management routes.
* **Authentication & Security**: Secure JSON Web Tokens (JWT) stored in HTTP-only cookies to prevent client-side script tampering, coupled with server-side role verification.
* **Database**: MongoDB with Mongoose ODM modeling users, events, service catalogs, and invitee subdocuments with optimized schema normalization.
* **Automated Mailer**: Centralized Nodemailer utility with Gmail SMTP and branded HTML templates for event confirmations, booking alerts, and invitation dispatches.


## Screenshots

| **Landing Page** | **Sign Up (Service Provider)** |
|---|---|
| <img src="https://github.com/user-attachments/assets/6bb88440-4acf-42c3-9bd9-9074df33a8cb" width="500" alt="Landing page"> | <img src="https://github.com/user-attachments/assets/ab741b92-b595-4c77-b54c-f08de0b709b0" width="500" alt="Sign Up"> |

| **Sign Up (Event Creator)** | **Login** |
|---|---|
| <img src="https://github.com/user-attachments/assets/2b2dce36-b124-4081-8ae0-78233afb6873" width="500" alt="Sign Up Creator"> | <img src="https://github.com/user-attachments/assets/7e7456b6-1b94-4549-bc2e-1421d023c616" width="500" alt="Login"> |

| **Dashboard (Event Creator)** | **Dashboard (Service Provider)** |
|---|---|
| <img src="https://github.com/user-attachments/assets/b5c1f72a-902d-4d15-8f8d-4774c50b7b4b" width="500" alt="Dashboard Creator"> | <img src="https://github.com/user-attachments/assets/034d1044-cfb6-4350-8647-aa10fca662c8" width="500" alt="Dashboard Provider"> |

| **Email (Event Creator)** | **Email (Service Provider)** |
|---|---|
| <img src="https://github.com/user-attachments/assets/6cd5a39c-46a0-4fb2-a535-9103ce8553be" width="500" alt="Email Creator"> | <img src="https://github.com/user-attachments/assets/fc859802-2a2c-4f5c-9812-8af167f79485" width="500" alt="Email Provider"> |


## Core Platform Features

### For Event Creators
* **Guided Event Setup**: Plan events by type, location, and date with tailored vendor categories.
* **Vendor Booking**: Browse and book caterers, decorators, venues, and photographers.
* **Task Checklist**: Manage to-dos and track preparation progress directly on your event dashboard.
* **Event Management**: Monitor active upcoming celebrations and review completed past events.
* **Canva Integration**: Create custom flyers and invitations with Canva.

### For Service Providers
* **Portfolio Showcase**: Display service offerings, pricing, location details, and photo galleries.
* **Client Inquiries**: Receive and manage client booking requests.

<h2 align="center">What's New in Eventra 2.0</h2>

* **Two-Way Vendor Booking & Settlement**: Booking approvals, delivery verification, and offline payment confirmations.
* **Digital RSVP Portal (`/rsvp/:eventId`)**: Shareable guest link to collect real-time attendance, party headcount, and dietary preferences.
* **Smart Invitee Management**: Auto-saving guest lists with CSV bulk imports, live door check-ins, and batch email or send WhatsApp invites.
* **Polished UI**: Clean, zinc theme design.


## Eventra 2.0 Roadmap

- [x] **Feature 1**: Vendor Booking & Offline Settlement Flow
- [x] **Feature 2**: Public Digital RSVP Portal & Invitee Management Hub
- [ ] **Feature 3**: Smart Event Budget Tracker (Track target budget vs. actual costs with visual breakdown)
- [ ] **Feature 4**: Service Provider Ratings & Verified Reviews (5-star rating system with client feedback)
- [ ] **Feature 5**: Advanced Discovery & Smart Filtering (Filter by price range, distance, category, and minimum rating)
- [ ] **Feature 6**: Event Countdown & Readiness Widget (Real-time countdown timer, checklist progress, and readiness score)
- [ ] **Feature 7**: Calendar Sync (.ics export & Google Calendar) & Downloadable Schedule PDF


## Getting Started

To install dependencies and run the project locally, refer to the complete guide:

**[DEVELOPMENT.md](./DEVELOPMENT.md)**


## Contact & Support

Feel free to reach out if you have questions, feedback, or suggestions!

## Collaboration & Contribution Notice

> [!NOTE]  
> **Currently not open to collaboration.**  
> This repository is a personal project and is currently not accepting external pull requests or contributions. Please do not raise PRs.

## License

**©Abheeshta-P. All Rights Reserved.**  

> **Note**: Project is under development for 2.0