# Apartment Management API

**TriBook** is a tourist apartment management system for Catalonia, allowing administrators to manage apartments and clients to view listings. Each apartment includes details like title, description, room count, photos, pricing, amenities, and location coordinates. The system currently supports two user types: administrators, who can create and edit listings, and clients, who can browse apartments without authentication.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Testing User Authentication](#testing-user-authentication)
- [API Documentation](#api-documentation)

---

## Features
- User authentication (signup, login, logout)
- Browse available apartments
- Search and filter apartments based on various criteria
- View detailed information about each apartment
- Make reservations for apartments
- Admin access for managing apartments (add, edit, delete)

---

## Technologies
- **Backend**: Node.js with Express.js
- **Database**: Mongoose (ODM for MongoDB)
- **Frontend**: EJS, CSS, JavaScript
- **Authentication**: Express-session
- **Other tools**: Swagger for API documentation

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Atlas or local instance)

### Installation
1. Clone the repository.
2. Install dependencies with `npm install`.
3. Create a `.env` file and define your environment variables, such as MongoDB connection URL, session secret, etc.
4. Start the server using `npm start`.
5. The project will be available at `http://localhost:3000`.

---

## Project Structure
- **app.js**: Main application file
- **routes/**: Contains route definitions
- **controllers/**: Handles the logic for each route
- **models/**: Defines MongoDB schemas
- **views/**: EJS templates for rendering pages
- **public/**: Static assets (CSS, client-side JS, images)

---

## Testing User Authentication
1. Try signing up as a new user.
2. For the purpose of testing you may use the following credentials:
    Username: admin7
    Password: Testing1@
3. Log out and then log back in with the newly created account.
4. Attempt to access admin features with a non-admin account to ensure proper access control.

---

## API Documentation
API documentation is available via Swagger UI. After starting the server, navigate to `http://localhost:3000/api/doc` to view the API documentation.
