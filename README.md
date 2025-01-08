# [WDA-Real-Estate](https://wda-real-estate.vercel.app)

## Demo

![WDA-Real-Estate-Demo-1](/frontend/src/assets/demo.png)

## Overview

This is a real estate platform built with ReactJS, NodeJS, and MongoDB. The platform allows users to browse properties, search and filter properties by location, type, price, and more. It features user authentication, profile management, and property CRUD functionalities. Public routes display property listings and detailed property pages, while authenticated users can create, edit, and delete their property listings.

## Technologies Used

- ReactJS
- Tailwind CSS
- Redux
- Axios
- Cloudinary
- MongoDB
- NodeJS
- ExpressJS
- JWT Authentication

## Features

- **Property CRUD:** Registered users can add new property listings, update existing listings, or remove them.
- **Search and Filter Options:** Users can search for properties by name or location and filter them by category, price, type, and more.
- **Contact Property Owners:** Users can contact property owners directly via email from the property details page.
- **Pagination:** The property listing page supports pagination, allowing users to view a limited number of properties per page.
- **Property Details Page:** Each property has a detailed page showing comprehensive information about the property, including images and features.
- **User Dashboard:** A central location where users can manage their profile and property listings, providing easy access to edit personal details and manage the properties they have listed.

## Setup and Running the Project

To run this project locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/webdevaminul/WDA-Real-Estate.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd WDA-Real-Estate
   ```

3. **Project Structure**: After cloning, you will see two main folders:

   - frontend: Contains the client-side code (React application).
   - backend: Contains the server-side code (Express, MongoDB).

4. **Running the Backend**:

   - Open a new terminal and navigate to the backend folder:

   ```bash
   cd backend
   ```

   - Install the required dependencies:

   ```bash
    npm install
   ```

   - Setup .env:
     Create a .env file in the backend folder and configure any necessary environment variables (e.g., MongoDB URI).

   - Start the backend server:

   ```bash
   npm run dev
   ```

5. **Running the Frontend**:

   - Open a new terminal and navigate to the frontend folder:

   ```bash
   cd frontend
   ```

   - Install the required dependencies:

   ```bash
   npm install
   ```

   - Setup .env:
     Create a .env file in the frontend folder and configure any necessary environment variables (e.g., NODE_ENV).

   - Start the React App:

   ```bash
    npm run dev
   ```

## Important

Ensure both the backend and frontend servers are running and you have the required environment variables set up in the .env file for smooth operation.

## Creadit & Contributions

Contributions are welcome! Please fork the repository and submit a pull request for any feature additions or bug fixes.  
For any questions or inquiries, please contact [webdev.aminul@gmail.com].  
Happy coding!
