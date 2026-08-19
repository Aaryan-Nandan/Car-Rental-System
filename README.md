
🚗 CarRental.com — Frontend

A full-stack Car Rental Management System frontend built with React.js. It provides customer and administrator interfaces for browsing cars, making bookings, completing payments, viewing booking/payment history, submitting reviews, managing vehicles, and interacting with the chatbot.

📖 Table of Contents

About the Project
Features
Technology Stack
Architecture
Project Structure
Customer Modules
Admin Modules
Home Page
Booking System
Payment System
Google Maps
Driving License
Reviews
AI Chatbot
Vehicle Images
Frontend–Backend Communication
Installation
Running the Project
Configuration
CORS
Security
Common Issues
GitHub Workflow
Future Improvements
Testing
Interview Explanation
Developer

📖 About the Project

CarRental.com Frontend is the React.js frontend of a full-stack car rental application.

The frontend communicates with a Spring Boot REST API, while the backend manages business logic, database operations, authentication-related services, bookings, payments, reviews, and email notifications.

Main workflow
React Frontend
      │
      │ REST API
      ▼
Spring Boot Backend
      │
      ▼
MySQL Database

External integrations include:

Frontend / Backend → Google Maps
Backend → Razorpay
Backend → Email Service

✨ Features

👤 Customer Features

Customer registration
OTP verification
Login
Forgot password
Browse available cars
View car details
View fuel type
View price per day
View vehicle availability
Select rental dates
Calculate rental duration
Calculate total booking amount
Driving-license selection/upload
Pickup-location selection
Google Maps integration
Create booking
Online payment
Payment-success handling
View My Bookings
View My Payments
Submit ratings
Submit reviews
AI chatbot

👨‍💼 Admin Features

Admin dashboard
Manage cars
Add physical cars
Edit cars
Delete cars
Manage availability
Manage bookings
View booking status
Manage reviews
View payment information
Customer management
🛠️ Technology Stack
Technology	Purpose
React.js	Frontend framework
JavaScript	Application logic
HTML	Page structure
CSS	Styling
React Router	Navigation
REST API	Backend communication
Google Maps	Pickup-location functionality
Razorpay	Payment workflow
Git	Version control
GitHub	Repository hosting

🏗️ Architecture

                     CarRental.com
                           │
                           ▼
                    React Frontend
                           │
                    ┌──────┴──────┐
                    │             │
                Customer        Admin
                    │             │
                    ▼             ▼
              Customer Pages   Dashboard
                    │             │
                    └──────┬──────┘
                           │
                           ▼
                    REST API Calls
                           │
                           ▼
                  Spring Boot Backend
                           │
                           ▼
                         MySQL
                         
📂 Project Structure

frontend/
│
├── public/
│   └── car-rental-logo.png
│
├── src/
│   │
│   ├── assets/
│   │   ├── defender.jpg
│   │   ├── ertiga.jpg
│   │   ├── exter.jpg
│   │   ├── mercedes-c-class.jpg
│   │   ├── mg-windsor-ev.jpg
│   │   ├── mg-zs-ev.jpg
│   │   ├── porsche-cayenne.jpg
│   │   ├── punch.jpg
│   │   └── xuv400-ev.jpg
│   │
│   ├── components/
│   │   ├── ChatBot.js
│   │   └── ChatBot.css
│   │
│   ├── pages/
│   │   ├── Home.js
│   │   ├── BookingPage.js
│   │   ├── PaymentPage.js
│   │   ├── MyBookings.js
│   │   ├── MyPayments.js
│   │   ├── ReviewPage.js
│   │   ├── ManageReviews.js
│   │   ├── AdminDashboard.js
│   │   ├── RegisterPage.js
│   │   └── SuccessRegistration.js
│   │
│   ├── App.js
│   └── index.js
│
├── package.json
└── README.md
👤 Customer Modules

The customer side contains the following major pages:

Customer
│
├── Home
│
├── Register
│
├── Login
│
├── Booking
│
├── Payment
│
├── My Bookings
│
├── My Payments
│
└── Reviews

🏠 Home Page

Home.js is the main customer landing page.

It displays:

Car variants
Vehicle images
Car company
Fuel type
Price per day
Available vehicles
Coming-soon vehicles
Booking entry points
Chatbot

Example:

Car
│
├── Variant Name
├── Company
├── Fuel Type
├── Image
├── Price Per Day
└── Available Cars

The preferred architecture is:

Database
   ↓
Spring Boot
   ↓
REST API
   ↓
Home.js
   ↓
Car Availability

This avoids relying on hard-coded availability values.

🚘 Vehicle Images

Vehicle images are stored inside:

src/assets/

Current vehicle assets include:

mg-zs-ev.jpg
mg-windsor-ev.jpg
xuv400-ev.jpg
ertiga.jpg
exter.jpg
punch.jpg
defender.jpg
mercedes-c-class.jpg
porsche-cayenne.jpg

Example import:

import defenderImage from "../assets/defender.jpg";

The filename must exactly match the actual file.

For example:

defender.jpg

must not be imported as:

Defender.jpg

if the actual filename is lowercase.

📅 Booking System

The main booking page is:

src/pages/BookingPage.js

The booking workflow is:

Home
  ↓
Select Car
  ↓
BookingPage
  ↓
Select From Date
  ↓
Select To Date
  ↓
Calculate Rental Days
  ↓
Calculate Total Amount
  ↓
Driving License
  ↓
Pickup Location
  ↓
Create Booking
  ↓
Payment

💰 Booking Amount Calculation

The basic calculation is:

Rental Days × Price Per Day
              =
        Total Amount

Example:

Price per day = ₹2,000
Rental days   = 3


Total = ₹2,000 × 3
      = ₹6,000

The frontend displays/calculates the amount, while the backend should remain responsible for important business validation.

📆 Date Selection

BookingPage.js contains the rental date controls.

fromDate
   +
toDate
   ↓
Rental Duration
   ↓
Price Calculation
   ↓
Total Amount

The booking page should validate:

From date
To date
Valid date range
Required fields

🪪 Driving License

The booking page provides the customer with a driving-license selection/upload interface.

Customer
   ↓
BookingPage.js
   ↓
Select License
   ↓
Booking Request
   ↓
Backend
Important

The frontend cannot determine whether a driving license is genuinely valid or fake.

Actual document verification would require additional services such as:

OCR
Document verification
Identity verification
Government/authorized verification service

📍 Google Maps

Google Maps functionality is used for pickup-location selection/search.

The booking information can contain:

Pickup Address
Pickup Locality
Pickup City
Pickup District
Pickup State
Pickup Pincode
Latitude
Longitude

Architecture:

Google Maps
     ↓
BookingPage.js
     ↓
Pickup Information
     ↓
Spring Boot
     ↓
MySQL

💳 Payment System

The main payment page is:

src/pages/PaymentPage.js

Payment workflow:

Booking
   ↓
PaymentPage.js
   ↓
Backend Payment API
   ↓
Razorpay
   ↓
Customer Payment
   ↓
Backend Verification
   ↓
Payment Saved
   ↓
Booking Updated
   ↓
Success
Important security rule

Razorpay secret credentials must never be placed directly inside React frontend code.

They belong on the backend.

📋 My Bookings

File:

src/pages/MyBookings.js

This page displays the customer's booking history.

Typical information:

Booking
├── Booking ID
├── Car
├── Car Variant
├── From Date
├── To Date
├── Total Amount
├── Booking Status
└── Assigned Car

Possible booking states include:

PENDING
APPROVED
REJECTED
CONFIRMED

💳 My Payments

File:

src/pages/MyPayments.js

It displays payment history retrieved from the backend.

Information can include:

Payment
├── Amount
├── Payment Method
├── Payment Status
├── Payment Date
└── Booking Information

⭐ Reviews

Customer review page:

src/pages/ReviewPage.js

Admin review management:

src/pages/ManageReviews.js

Workflow:

Customer
   ↓
ReviewPage.js
   ↓
Review API
   ↓
Spring Boot
   ↓
MySQL

Review data includes:

Rating
Review
Review Date
Customer
Car Variant

👨‍💼 Admin Dashboard

File:

src/pages/AdminDashboard.js

The dashboard provides the administration interface.

Admin Dashboard
│
├── Cars
├── Car Variants
├── Bookings
├── Payments
├── Customers
└── Reviews

🚘 Manage Cars

The admin can manage physical cars through the frontend.

Typical workflow:

Admin
 ↓
Manage Cars
 ↓
Add / Edit / Delete
 ↓
Backend API
 ↓
Database

Car information can include:

Car
├── Registration Number
├── Car Variant
└── Availability

The physical car is separate from the car variant.

For example:

MG ZS EV
│
├── BR01AA1234
├── DL04BB5678
└── MH12CC9012

🤖 AI Chatbot

The project contains:

src/components/ChatBot.js
src/components/ChatBot.css

The chatbot UI provides:

Floating chatbot button
Open/close functionality
Chat window
User messages
Bot messages
Input box
Close button
Custom logo
Responsive styling

Structure:

components/
│
├── ChatBot.js
└── ChatBot.css
Security

If the chatbot connects to an AI API, private API keys should not be exposed in React.

Preferred architecture:

React ChatBot
      ↓
Backend API
      ↓
AI Service
      ↓
Response
      ↓
React ChatBot

🖼️ Logo

The current public logo is:

public/car-rental-logo.png

If you replace the logo filename, update every frontend reference accordingly.

🔌 Frontend ↔ Backend Communication

The complete system works like this:

React
localhost:3000
      │
      │ HTTP / REST
      ▼
Spring Boot
Backend Port
      │
      ▼
MySQL

For example:

BookingPage.js
      ↓
POST Booking API
      ↓
BookingController
      ↓
BookingService
      ↓
BookingRepository
      ↓
MySQL

🌐 CORS

Because React and Spring Boot normally run on different ports during development, the backend must allow the frontend origin.

Example:

Frontend
http://localhost:3000


Backend
http://localhost:<BACKEND_PORT>

If the frontend suddenly cannot connect to the backend, check:

Backend is running.
Frontend API URL is correct.
Backend port is correct.
Endpoint path is correct.
CORS configuration is correct.
MySQL is running.

⚙️ Configuration

The frontend must use the correct backend API URL.

Conceptually:

const API_BASE_URL = "http://localhost:<BACKEND_PORT>";

Use the actual port configured in your Spring Boot backend.

Do not put:

Database password
Razorpay secret
Email password
Private API secret

inside React source code.

▶️ Installation

1. Clone Repository
git clone https://github.com/Aaryan-Nandan/CarRental.com.git
2. Open Frontend
cd CarRental.com/frontend
3. Install Dependencies
npm install
4. Start React
npm start

The development server normally opens at:

http://localhost:3000

🔄 Complete Customer Flow

                    CUSTOMER
                       │
                       ▼
                     HOME
                       │
                       ▼
                  SELECT CAR
                       │
                       ▼
                 BOOKING PAGE
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
           Dates    License    Location
             │         │         │
             └─────────┼─────────┘
                       ▼
                 CREATE BOOKING
                       │
                       ▼
                    PAYMENT
                       │
                       ▼
                   RAZORPAY
                       │
                       ▼
                  VERIFICATION
                       │
                       ▼
                    SUCCESS
                       │
              ┌────────┴────────┐
              ▼                 ▼
         MY BOOKINGS       MY PAYMENTS
         
🔄 Complete Admin Flow
                    ADMIN
                      │
                      ▼
                ADMIN DASHBOARD
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     MANAGE        BOOKINGS       REVIEWS
       CARS            │
        │              │
   ┌────┼────┐         │
   ▼    ▼    ▼         ▼
  Add  Edit Delete   Status
       │
       ▼
 Availability
 
🔐 Frontend Security

The frontend is not a trusted security layer.

Never expose:

❌ Database password
❌ Razorpay secret key
❌ Email password
❌ Private backend credentials
❌ Private AI API key

Frontend validation is mainly for user experience.

Important business/security validation must happen in the backend.

⚠️ Common Problems

Frontend does not connect to backend

Check:

1. Backend running?
2. Correct backend port?
3. Correct API URL?
4. Correct endpoint?
5. CORS configured?
6. MySQL running?
Image not showing

Check:

src/assets/defender.jpg

and:

import defenderImage from "../assets/defender.jpg";

The filename must match exactly.

Chatbot not showing

Check:

src/components/ChatBot.js
src/components/ChatBot.css

and verify that ChatBot is imported/rendered where required.

ESLint warning

For example:

'SmallInfo' is defined but never used

This means a component/function was declared but isn't being used.

Either use it or remove it.

📦 .gitignore

Generated dependencies and build files should normally not be committed.

Example:

node_modules/
build/
.env
🔧 GitHub Workflow

The project uses one repository:

CarRental.com
│
├── frontend
│
└── backend

Frontend can be developed using:

VS Code

Backend can be developed using:

IntelliJ IDEA

Both can commit to the same Git repository.

Example:

git status


git add .


git commit -m "Update frontend"


git push origin main

Before pushing when remote changes exist:

git fetch origin
git pull --rebase origin main
git push origin main

Avoid unnecessary:

git push --force

🧪 Testing Strategy

Component Tests
       ↓
Page Tests
       ↓
API Integration Tests
       ↓
End-to-End Tests

Important areas to test:

Home page car rendering
Vehicle availability
Booking form
Date calculation
Total amount
Driving-license selection
Pickup location
Payment response
Booking history
Payment history
Review submission
Admin car management
Admin review management
Chatbot open/close behavior

⚠️ Current Limitations

Frontend cannot independently verify whether a driving license is genuine.
Payment secrets must remain on the backend.
API URLs must match the actual Spring Boot configuration.
Some UI values such as "Coming Soon" may be presentation values unless supplied dynamically by the backend.
Exact API endpoints should be verified against the current backend controllers.
Frontend validation should not be treated as backend security.

🚀 Future Improvements

Authentication
Protected routes
Role-based routing
Central authentication state
Automatic logout
UI
Better mobile responsiveness
Loading skeletons
Better error messages
Improved form validation
Accessibility improvements
Architecture
Central API service
Reusable components
Centralized error handling
React Context/Redux where useful
Testing
Unit tests
Component tests
Integration tests
End-to-end testing
Production
Environment configuration
CI/CD
Cloud deployment
Monitoring
Chatbot
Secure backend AI integration
Context-aware car rental assistance
Booking-related assistance

📌 Important Design Decisions

1. Separate Customer and Admin UI
Customer
   ↓
Booking / Payment / Reviews


Admin
   ↓
Cars / Bookings / Reviews / Dashboard
2. Separate Car Variant and Physical Car
MG ZS EV
   │
   ├── BR01AA1234
   ├── DL04BB5678
   └── MH12CC9012
3. Backend as Data Source

Instead of relying on hard-coded data:

MySQL
 ↓
Spring Boot
 ↓
React
4. Sensitive Logic on Backend
React
 ↓
API
 ↓
Spring Boot
 ↓
Sensitive operation

🚀 Roadmap

CURRENT
│
├── Home
├── Registration
├── Booking
├── Payment
├── My Bookings
├── My Payments
├── Reviews
├── Admin Dashboard
├── Car Management
├── Review Management
└── Chatbot
       │
       ▼
NEXT
│
├── Protected Routes
├── Central API Service
├── Better Validation
├── Loading States
├── Error Handling
├── Testing
├── Accessibility
└── Mobile Improvements
       │
       ▼
PRODUCTION
│
├── Environment Configuration
├── CI/CD
├── Cloud Hosting
└── Monitoring

👨‍💻 Developer

Aaryan Nandan

B.Tech — Computer Science & Engineering
Specialization — Artificial Intelligence & Machine Learning

Technologies
Java
C++
Python
Spring Boot
React.js
JavaScript
MySQL
SQL
HTML
CSS
REST APIs
Git
GitHub

📄 License

This project was developed for educational, portfolio and learning purposes.

⭐ CarRental.com

                    CarRental.com
                         │
          ┌──────────────┴──────────────┐
          │                             │
       Frontend                      Backend
          │                             │
      React.js                    Spring Boot
          │                             │
          └──────────────┬──────────────┘
                         │
                       MySQL
                         │
             ┌───────────┼───────────┐
             │           │           │
          Razorpay   Google Maps    Email

CarRental.com is a full-stack car rental management system designed around vehicle management, booking, payment, reviews, customer management, administration and automated communication workflows.











