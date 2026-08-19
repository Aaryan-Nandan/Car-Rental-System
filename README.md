📌 Project Overview

CarRental.com is designed to provide a complete digital platform for managing a car rental business.

The application contains two major sides:

👤 Customer Side
👨‍💼 Admin Side

The system connects a React.js frontend with a Spring Boot REST API and MySQL database.

                    CarRental.com
                         │
             ┌───────────┴───────────┐
             │                       │
        Customer Portal         Admin Portal
             │                       │
             └───────────┬───────────┘
                         │
                  React Frontend
                         │
                    REST APIs
                         │
                  Spring Boot
                         │
                Service Layer
                         │
               Repository Layer
                         │
                      MySQL
                      
🛠️ Technology Stack

Frontend
React.js
JavaScript
HTML5
CSS3
React Router
REST API integration
Google Maps integration
Responsive UI
Backend
Java
Spring Boot
Spring Data JPA
Hibernate
REST APIs
Maven
Database
MySQL
MySQL Workbench
External Services
Razorpay Payment Gateway
Google Maps API
Email service
OTP-based verification
Development Tools
Visual Studio Code
IntelliJ IDEA
Git
GitHub
MySQL Workbench

✨ Main Features
👤 Customer Features

Registration & Login Customers can:

Register an account
Verify registration using OTP
Login to the system
Logout
Manage their profile
Update personal information
Reset forgotten passwords

🔐 OTP Verification

The system supports OTP-based verification for important account operations.

OTP functionality is used for:

Customer registration
Email verification
Forgot password functionality

🚘 Car Browsing

Customers can view available rental vehicles.

Each vehicle can contain information such as:

Car name
Car company
Fuel type
Price per day
Available quantity
Car image

Customers can search and filter cars based on available information.

🚗 Car Variants

The system supports multiple car variants and companies.

Examples include:

Hyundai
Kia
Tata
Mahindra
Toyota
MG
Other added vehicle variants

The system supports different fuel categories including:

Petrol
Diesel
CNG
Electric / EV

Car variants can be managed dynamically through the admin side.

📅 Online Booking

Customers can create a rental booking by selecting:

Car
From date
To date
Pickup location
Driving license

The system calculates the rental amount according to the selected rental period and vehicle price.

📍 Pickup Location

The booking process includes pickup-location functionality.

Customers can:

Use their current location
Search for a location
Enter an area, road, city or PIN code
Select a location through Google Maps

The booking stores location information such as:

Pickup address
Locality
City
District
State
PIN code
Latitude
Longitude

🪪 Driving License

Customers are required to provide their driving-license document during the booking process.

The booking stores the uploaded license information for administrative verification.

The current system provides document upload/storage functionality. It does not automatically determine whether a driving license is genuine or fake.

The admin can review the booking/document before approving it.

💳 Online Payment

The project integrates Razorpay for online payments.

Payment information includes:

Amount
Payment method
Payment status
Razorpay Order ID
Razorpay Payment ID
Razorpay Signature
UPI transaction ID
Payment date
Associated booking

Payment statuses supported by the backend include:

CREATED
PAID
FAILED
REFUNDED

📧 Email Notifications

The backend contains email functionality for important operations.

Email/OTP services are used for:

Registration OTP
Forgot-password OTP
Booking-related notifications
Payment-related notifications

The email functionality is handled by the Spring Boot backend.

📋 My Bookings

Customers can view their booking history from My Bookings.

Booking information includes:

Car
Rental dates
Booking amount
Booking status
Pickup location
Assigned vehicle information

The customer can filter bookings according to their status.

Example statuses include:

Pending
Approved
Rejected

💰 My Payments

Customers can view their payment history through My Payments.

Payment history contains information such as:

Booking
Amount
Payment status
Payment date
Payment method
Transaction information

⭐ Reviews & Ratings

Customers can submit reviews for cars/car variants.

A review contains:

Rating
Review text
Review date
Customer
Car variant

The backend supports retrieving reviews:

By car variant
By customer

Administrators can manage reviews through the admin interface.

👨‍💼 Admin Dashboard

The system provides a dedicated admin dashboard.

Administrators can manage:

Cars
Car variants
Car companies
Customers
Bookings
Payments
Reviews
Vehicle availability

🚘 Manage Cars

Administrators can:

Add new cars
Edit cars
Delete cars
Change car availability
Assign a car variant
Set registration numbers
Set vehicle color
View fuel type
View price per day

Each actual car has its own unique registration number.

The system also prevents duplicate registration numbers.

📊 Car Availability

The system distinguishes between:

Car Variant
      ↓
Actual Cars
      ↓
Available Cars

For example:

i20
 ├── BR 01 XX 1234
 ├── RJ 14 XX 4567
 ├── WB 26 XX 7890
 └── DL 08 XX 2345

The available-car count is calculated from the actual cars belonging to a variant.

📦 Booking Management

Administrators can view customer bookings and manage their status.

The admin can:

View bookings
Approve bookings
Reject bookings
Assign an actual vehicle
Manage booking status
View customer information
View car information
View rental dates
View payment information

💳 Admin Payment Management

Administrators can view payment information associated with bookings.

The payment and booking entities are connected so that the admin can see payment information together with the related booking.

👥 Customer Management

Administrators can manage registered customer information.

Customer information can include:

Name
Email
Phone number
Address
Other registered profile information

🧑‍💼 Admin Management

The backend contains an Admin entity with administrator information.

Admin information includes:

Name
Email
Password
Phone number
Aadhaar number
Address

Admin information is stored in the MySQL database.

🤖 Chatbot

The frontend includes a basic car-rental chatbot.

The chatbot is available from the website interface and provides users with basic assistance related to the car rental application.

It is implemented as a frontend component:

frontend/src/components/ChatBot.js
frontend/src/components/ChatBot.css

It should be described as a basic chatbot, not as a fully autonomous AI agent.

🗺️ Google Maps Integration

The booking page includes Google Maps functionality for pickup-location selection.

Customers can:

Search pickup locations
Use current location
Select locations
Store geographical coordinates

🏗️ Project Structure

CarRental.com/
│
├── backend/
│   └── backend/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/example/backend/
│       │   │   │       ├── controller/
│       │   │   │       ├── entity/
│       │   │   │       ├── repository/
│       │   │   │       └── service/
│       │   │   │
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   │
│       │   └── test/
│       │
│       └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── README.md
└── .gitignore

📁 Important Frontend Pages

The React application contains pages/modules such as:

Home.js
Login.js
RegisterPage.js
BookingPage.js
PaymentPage.js
MyBookings.js
MyPayments.js
ProfilePage.js
ReviewPage.js
AdminLogin.js
AdminDashboard.js
ManageCars.js
ManageReviews.js

The project also contains reusable components including:

ChatBot.js
Navbar.js
LoadingSpinner.js
OTPInput.js
PasswordStrength.js
ProtectedRoute.js

📁 Important Backend Layers

Entity Layer

The backend contains entities including:

Admin
Customer
Car
CarVariant
CarCompany
Booking
Payment
Review
Repository Layer

Spring Data JPA repositories are used for database operations.

Examples include:

AdminRepository
BookingRepository
CarRepository
PaymentRepository
ReviewRepository
Service Layer

Business logic is handled through service classes such as:

BookingService
PaymentService
RegistrationOtpService
ForgotPasswordService

🗄️ Database Relationships

The application uses JPA relationships between major entities.

Example:

CarCompany
     │
     └── CarVariant
             │
             ├── Car
             │
             ├── Booking
             │
             └── Review

Booking connects:

Customer
    │
    └── Booking
          ├── CarVariant
          ├── Car
          └── Payment
          
⚙️ Backend Configuration

Backend configuration is maintained in:

backend/backend/src/main/resources/application.properties

Typical configuration includes:

spring.datasource.url=jdbc:mysql://localhost:3306/car_rental_system
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

Other configuration may include:

Server port
Email configuration
Razorpay configuration
JPA/Hibernate configuration

🔒 Security

Never commit real credentials to GitHub.

Do not expose:

Database passwords
Email passwords
Razorpay secret keys
API keys

Use environment variables or local configuration for sensitive values.

▶️ How to Run the Project

1. Clone the repository
git clone https://github.com/Aaryan-Nandan/CarRental.com.git
cd CarRental.com
2. Start MySQL

Create the required database:

CREATE DATABASE car_rental_system;

Configure the database credentials in:

backend/backend/src/main/resources/application.properties
3. Start Backend

Open the backend project in IntelliJ IDEA.

Run:

BackendApplication.java

Or use Maven:

mvn spring-boot:run

The backend runs on the port configured in application.properties.

4. Start Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Start React:

npm start

The frontend will normally run on:

http://localhost:3000

🔄 Complete Application Flow
                 CUSTOMER
                    │
                    ▼
             React Frontend
                    │
                    ▼
             Spring Boot API
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      Service Layer      Authentication
          │
          ▼
     Repository Layer
          │
          ▼
         MySQL
Booking Flow
Browse Cars
     ↓
Select Car
     ↓
Select Rental Dates
     ↓
Select Pickup Location
     ↓
Upload Driving License
     ↓
Create Booking
     ↓
Payment
     ↓
Payment Verification
     ↓
Admin Review
     ↓
Approve / Reject
     ↓
Assign Actual Car
     ↓
Customer Booking Confirmation
     ↓
Email Notification

🔐 Security Considerations

The project includes authentication and verification features such as:

Admin authentication
Customer authentication
OTP verification
Password reset
Protected frontend routes
Unique registration numbers
Payment verification

Sensitive credentials should be stored outside the public repository.

🚀 Future Improvements

Possible future improvements include:

Automatic driving-license verification
AI-based document verification
JWT authentication
Role-based authorization
Cloud image storage
Advanced vehicle availability based on rental dates
Production deployment
Docker support
Automated testing
Advanced analytics
Real-time booking notifications

👨‍💻 Developer
**Aaryan Nandan**
GitHub: https://github.com/Aaryan-Nandan

B.Tech – Computer Science & Engineering
Specialization: Artificial Intelligence & Machine Learning

Technologies
Java
C++
Python
Spring Boot
React.js
MySQL
SQL
HTML
CSS
Git
GitHub


📄 License
This project was developed for educational and portfolio purposes.
