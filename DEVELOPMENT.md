# Eventra — Developer Setup & Installation Guide

This guide covers local environment setup, configuration, and developer workflows for Eventra.

For the project overview, architecture, and feature documentation, refer to the [README.md](./README.md).

> [!NOTE]  
> **Currently not open to collaboration.**  
> This repository is a personal project and is currently not accepting external pull requests or contributions. Please do not raise PRs.

## Table of Contents

- [Eventra — Developer Setup \& Installation Guide](#eventra--developer-setup--installation-guide)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation \& Setup](#installation--setup)
  - [Environment Configuration](#environment-configuration)
    - [1. Backend Environment (`backend/.env`)](#1-backend-environment-backendenv)
    - [2. Frontend Environment (`frontend/.env.local`)](#2-frontend-environment-frontendenvlocal)
  - [Running the Application](#running-the-application)
    - [1. Start MongoDB](#1-start-mongodb)
    - [2. Start Backend Server (with Nodemon Live-Reload)](#2-start-backend-server-with-nodemon-live-reload)
    - [3. Start Frontend Server](#3-start-frontend-server)
  - [Project Directory Structure](#project-directory-structure)
  - [Developer Notes](#developer-notes)


## Prerequisites

Before setting up the project locally, ensure you have the following installed on your machine:

* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **MongoDB**: A running local MongoDB instance (`mongodb://localhost:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI
* **Git**: Version control


## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abheeshta-P/Eventra.git
   cd Eventra
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Configuration

### 1. Backend Environment (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGODB=mongodb://localhost:27017/eventra
JWT_SECRET=your_secure_jwt_secret_key_here

# Optional: Email Service (Leave blank for mock logging mode during local dev)
EMAIL=your_company_email@gmail.com
PASS=your_gmail_app_password

# Optional: Cloudinary Storage (Required for Service Provider gallery uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Tip for Local Testing:** If `EMAIL` or `PASS` are omitted or left blank, Eventra automatically runs in **Mock Mailer** mode. Outgoing invitation and status emails are printed safely to the server console rather than sending real emails.

### 2. Frontend Environment (`frontend/.env.local`)

Create a `.env.local` file inside the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```


## Running the Application

### 1. Start MongoDB
Ensure your local MongoDB daemon is running:
```bash
# On Windows (Service or command)
mongod
```
*(Or verify your cloud MongoDB Atlas connection string is reachable).*

### 2. Start Backend Server (with Nodemon Live-Reload)
In the `backend/` directory:
```bash
npm run dev
```
*The Express API server starts on `http://localhost:5000` with hot-reload enabled via `nodemon.json`.*

### 3. Start Frontend Server
In the `frontend/` directory:
```bash
npm run dev
```
*The Next.js client will start on `http://localhost:3000`.*


## Project Directory Structure

```
Eventra/
├── backend/
│   ├── conf.js                    # Centralized environment variable loader
│   ├── db/                        # MongoDB connection handler
│   ├── controller/                # Request handlers and business logic
│   ├── middleware/                # JWT authentication & role-based middleware
│   ├── models/                    # Mongoose database schemas
│   ├── routes/                    # Express route definitions
│   ├── utils/
│   │   └── mailer.js              # Centralized Nodemailer client & HTML templater
│   ├── nodemon.json               # Nodemon watch configuration
│   └── server.js                  # Express application entry point
│
├── frontend/
│   ├── public/                    # Static brand assets and images
│   └── src/
│       ├── app/                   # Next.js 14 App Router pages
│       │   ├── dashboard/         # Role-specific dashboards (Creator & Provider)
│       │   ├── rsvp/[eventId]/    # Public digital RSVP portal
│       │   └── (auth)/            # Login, signup, and role selection
│       ├── components/            # Reusable UI component library
│       ├── constants/             # Category mappings & image sources
│       ├── store/                 # Redux Toolkit state slices
│       └── utils/                 # Client API service wrappers
```


## Developer Notes 

1. **Role-Based Access Control**:
   * Event Creator routes are protected by checking authenticated sessions for `userType: 'eventCreator'`.
   * Service Provider routes verify `userType: 'serviceProvider'`.
   * Public RSVP routes (`/public/rsvp/:eventId`) remain open for unauthenticated guest responses.

2. **Styling & Design System**:
   * Use neutral Tailwind CSS zinc colors (`bg-zinc-100`, `border-zinc-300`, `text-zinc-900`) with primary brand accent `#03089a`.
   * Avoid raw emojis in user-facing components; use icons from `react-icons` (e.g. `HiCheckCircle`, `HiMail`).
   * Apply `break-words [overflow-wrap:anywhere]` and flex container `min-w-0` to protect cards from unbroken string overflows.

