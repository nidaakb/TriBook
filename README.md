# Apartment Management API
TriBook is a tourist apartment management system for Catalonia, allowing administrators to manage apartments and clients to view listings. Each apartment includes details like title, description, room count, photos, pricing, amenities, and location coordinates. The system currently supports two user types: administrators, who can create and edit listings, and clients, who can browse apartments without authentication

## Table of Contents
- [Getting Started](#getting-started)
- [Technologies](#technologies)
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
  - [Admin Endpoints](#admin-endpoints)
    - [Add New Apartment](#add-new-apartment)
    - [Edit Apartment](#edit-apartment)
    - [Delete Apartment](#delete-apartment)
  - [Public Endpoints](#public-endpoints)
    - [List Apartments](#list-apartments)
    - [View Apartment Details](#view-apartment-details)
    - [Create Reservation](#create-reservation)
  - [Search](#search-endpoint)

## Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Create a `.env` file and define your environment variables, such as MongoDB connection URL, session secret, etc.
4. Start the server using `npm start`.
5. The project will be available at `http://localhost:3000`.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Atlas or local instance)

## Technologies

- **Node.js**
- **Express.js**: Framework for building RESTful services.
- **Mongoose**: ODM for MongoDB.
- **EJS**: Templating engine.
- **MongoDB Atlas**: Cloud database solution for storing apartments and reservations.
- **Express-session**: Session management for authentication.

## Data Model


