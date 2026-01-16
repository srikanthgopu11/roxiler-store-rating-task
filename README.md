
Store Rating Web Application

This is a Full-Stack application built for the Roxiler Systems Coding Challenge. It allows users to search and rate stores, store owners to view their ratings, and admins to manage the entire system.

🚀 Tech Stack

Frontend: React.js, CSS3 , Axios

Backend: Node.js, Express.js

Database: SQLite

Authentication: JWT (JSON Web Tokens) & Bcrypt (Password Hashing)

🔑 Key Features
1. Multi-Role Access Control

Admin: View system-wide stats (total users, stores, ratings), create new stores, and assign them to owners.

Normal User: Search for stores by name/address, sort stores by name or rating, and submit/update store ratings (1-5 stars).

Store Owner: View a personalized dashboard showing their store's performance and a list of all users who have provided ratings.

2. Functional Requirements Met

Search & Filter: Users can search for stores in real-time.

Sorting: Support for sorting stores alphabetically or by average rating.

Password Management: Secure password hashing and a profile feature for owners to update passwords.

Data Integrity: Prevention of duplicate ratings (one rating per user per store).

📋 Validation Rules 

Name: 5 to 60 characters.

Email: Must be a valid email format.

Password: 8-16 characters, must include at least one Uppercase letter and one Special character (!@#$%^&*).

Address: Up to 400 characters.

Ratings: Integer values between 1 and 5.

🛠️ Installation & Setup
Prerequisites

Node.js

VS Code 

1. Clone the repository

git clone <your-repo-link>
cd store-rating-app

2. Backend Setup

cd backend
npm install

Create a .env file in the backend folder:

PORT=5000
JWT_SECRET=your_super_secret_key

Start the backend: npm run dev

3. Frontend Setup

cd ../frontend
npm install

Start the frontend: npm start

📡 API Documentation
Auth Endpoints

POST /api/auth/signup - Register a new user (User/Owner/Admin).

POST /api/auth/login - Authenticate and receive a JWT.

PATCH /api/auth/update-password - (Protected) Update user password.

Admin Endpoints (Protected)

GET /api/admin/dashboard - Get total counts for the system.

GET /api/admin/users - List all registered users.

POST /api/admin/stores - Create a new store and link it to an owner.

User Endpoints (Protected)

GET /api/user/stores - List stores with search and sort functionality.

POST /api/user/ratings - Submit or update a store rating.

Owner Endpoints (Protected)

GET /api/owner/dashboard - Get store-specific ratings and statistics.

📦 Deployment

Backend: Deployed on Render

Frontend: Deployed on Netlify

Database: SQLite (Note: On free-tier hosting like Render, the database file resets on server restart).

Github Repo : []

Published Link : []
