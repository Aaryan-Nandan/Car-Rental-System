# 🚗 CarRental.com — Backend

Spring Boot REST API for the CarRental.com full-stack car rental management system.

The backend provides APIs and business logic for customer management, admin management, vehicle management, bookings, payments, reviews, OTP verification, email notifications, pickup locations, and vehicle availability.


## 📌 Table of Contents


- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Backend Architecture](#-backend-architecture)
- [Project Structure](#-project-structure)
- [Core Modules](#-core-modules)
- [Database Design](#-database-design)
- [Entity Relationships](#-entity-relationships)
- [Car Management](#-car-management)
- [Car Availability](#-car-availability)
- [Booking System](#-booking-system)
- [Driving License](#-driving-license)
- [Pickup Location](#-pickup-location)
- [Payment System](#-payment-system)
- [Razorpay Integration](#-razorpay-integration)
- [Email Notifications](#-email-notifications)
- [OTP Services](#-otp-services)
- [Review System](#-review-system)
- [Admin Management](#-admin-management)
- [Repository Layer](#-repository-layer)
- [REST API](#-rest-api)
- [Validation](#-validation)
- [Error Handling](#-error-handling)
- [Database Configuration](#-database-configuration)
- [Environment Variables](#-environment-variables)
- [Running the Backend](#-running-the-backend)
- [Frontend Integration](#-frontend-integration)
- [Git and GitHub](#-git-and-github)
- [Security](#-security)
- [Current Limitations](#-current-limitations)
- [Future Improvements](#-future-improvements)
- [Interview Explanation](#-interview-explanation)
- [Developer](#-developer)
- [License](#-license)

# 📖 About the Project


**CarRental.com Backend** is a RESTful backend application developed using **Java and Spring Boot**.


It provides the backend services required by the CarRental.com React frontend.


The system allows customers to:


- Register
- Verify registration using OTP
- Login
- Browse available cars
- View car details
- Select rental dates
- Upload driving-license information
- Select pickup locations
- Create bookings
- Make online payments
- View booking history
- View payment history
- Submit reviews


Administrators can:


- Manage car companies
- Manage car variants
- Manage physical cars
- Manage vehicle availability

This is one of the important design decisions in the application.

For example:

Hyundai
   ↓
Creta
   ↓
├── BR01AB1234
├── DL05CD5678
└── RJ14EF9012

Creta is the CarVariant.

BR01AB1234, DL05CD5678 and RJ14EF9012 are individual physical Car records.

This allows every physical vehicle to have:

Unique registration number
Individual availability
Individual assignment to bookings

🛠️ Technology Stack

Technology	Purpose
Java	Backend programming
Spring Boot	REST API framework
Spring Data JPA	Database access
Hibernate	ORM
MySQL	Relational database
Maven	Dependency management
REST API	Frontend communication
Razorpay	Online payments
JavaMail	Email notifications
Google Maps API	Pickup location functionality
Git	Version control
GitHub	Source code hosting

🏗️ System Architecture
                    CarRental.com
                         │
                         │
                  React Frontend
                         │
                         │ HTTP / REST
                         ▼
                Spring Boot Backend
                         │
             ┌───────────┴───────────┐
             │                       │
        Controller Layer       Configuration
             │
             ▼
         Service Layer
             │
             ▼
       Repository Layer
             │
             ▼
       Spring Data JPA
             │
             ▼
            MySQL

External integrations:

Spring Boot
    │
    ├── Razorpay
    ├── Email Service
    └── Google Maps related data
    
🧱 Backend Architecture

The backend follows a layered architecture.

Controller
     ↓
Service
     ↓
Repository
     ↓
Entity
     ↓
MySQL
Controller Layer

Controllers expose REST APIs.

They are responsible for:

Receiving HTTP requests
Reading request data
Calling services
Returning HTTP responses

Example:

@PostMapping("/add")
public ResponseEntity<?> addCar(
        @RequestBody Car car
) {
    ...
}
Service Layer

Services contain business logic.

Important services include:

BookingService
PaymentService
CarService
CarVariantService
RegistrationOtpService
ForgotPasswordService

The service layer handles:

Validation
Business rules
Database operations through repositories
Booking processing
Payment processing
Email notifications
Repository Layer

Repositories use Spring Data JPA.

Example:

public interface CarRepository
        extends JpaRepository<Car, Long> {
}

This avoids writing most SQL manually for standard CRUD operations.

Entity Layer

Entities represent database tables.

Main entities:

Admin
Customer
CarCompany
CarVariant
Car
Booking
Payment
Review

📂 Project Structure

backend/
└── backend/
    │
    ├── src/
    │   │
    │   ├── main/
    │   │   │
    │   │   ├── java/
    │   │   │   └── com/
    │   │   │       └── example/
    │   │   │           └── backend/
    │   │   │
    │   │   │               ├── controller/
    │   │   │               │
    │   │   │               ├── entity/
    │   │   │               │
    │   │   │               ├── repository/
    │   │   │               │
    │   │   │               ├── service/
    │   │   │               │
    │   │   │               └── BackendApplication.java
    │   │   │
    │   │   └── resources/
    │   │       └── application.properties
    │   │
    │   └── test/
    │
    ├── pom.xml
    └── README.md
    
🧩 Core Modules

The backend is divided into several functional modules.

Authentication
      │
      ├── Registration OTP
      └── Forgot Password


Vehicle Management
      │
      ├── Car Company
      ├── Car Variant
      ├── Physical Car
      └── Availability


Booking
      │
      ├── Dates
      ├── Customer
      ├── Vehicle
      ├── License
      └── Pickup Location


Payment
      │
      ├── Razorpay
      ├── Verification
      └── Payment History


Communication
      │
      └── Email


Reviews
      │
      ├── Rating
      └── Review


Administration
      │
      ├── Customers
      ├── Cars
      ├── Bookings
      ├── Payments
      └── Reviews
      
🗄️ Database Design

The backend uses MySQL with Spring Data JPA / Hibernate.

Main tables/entities:

admin
customer
car_company
car_variant
car
booking
payment
review

🔗 Entity Relationships

The major relationship structure is:

CarCompany
     │
     │ 1
     │
     ▼
CarVariant
     │
     │ 1
     │
     ├───────────────┐
     │               │
     ▼               ▼
   Car            Review
     │
     │
     ▼
  Booking
   │    │
   │    └──────────────► Customer
   │
   ▼
 Payment
 
🚘 Car Management

Car management has two major concepts:

CarVariant

Represents a model.

Example:

Creta
Venue
i20
Verna
Seltos
Nexon
Scorpio
Fortuner
Thar
MG ZS EV
MG Windsor EV
XUV400 EV
Ertiga
Exter
Punch
Defender
Mercedes-Benz C-Class
Porsche Cayenne
Car

Represents an actual physical vehicle.

Example:

Creta
│
├── BR01AB1234
├── DL05CD5678
└── RJ14EF9012

🔢 Registration Number Validation

Every physical car must have a unique registration number.

The repository provides:

boolean existsByRegistrationNumber(
        String registrationNumber
);

For editing:

boolean existsByRegistrationNumberAndIdNot(
        String registrationNumber,
        Long id
);

The backend normalizes registration numbers before validation.

For example:

" br01ab1234 "

becomes:

"BR01AB1234"

This helps prevent duplicate records caused by differences in spaces or letter case.

📊 Car Availability

The backend calculates availability from actual physical car records.

Repository:

long countByCarVariantIdAndAvailableTrue(
        Long variantId
);

The logic is:

CarVariant
     ↓
Find Cars belonging to variant
     ↓
available = true
     ↓
COUNT
     ↓
Available Cars

Therefore, availability should not be hard-coded in the React frontend.

🔄 Availability Toggle

A physical vehicle can be marked available/unavailable.

Example:

Available
    ↓
Unavailable

or:

Unavailable
    ↓
Available

This is useful when a vehicle:

Is rented
Is under maintenance
Is unavailable
Returns to the fleet

📅 Booking System

The Booking entity stores:

id
fromDate
toDate
totalAmount
licenseFileName
bookingStatus


pickupAddress
pickupLocality
pickupCity
pickupDistrict
pickupState
pickupPincode
pickupLatitude
pickupLongitude


customer
carVariant
car

🔄 Booking Lifecycle

The general booking lifecycle is:

Customer
   │
   ▼
Select Car Variant
   │
   ▼
Select From / To Date
   │
   ▼
Select Pickup Location
   │
   ▼
Upload Driving License
   │
   ▼
Create Booking
   │
   ▼
Payment
   │
   ▼
Payment Verification
   │
   ▼
Admin Review
   │
   ├───────────────┐
   ▼               ▼
APPROVED        REJECTED
   │
   ▼
Assign Physical Car
   │
   ▼
CONFIRMED

🟡 Booking Status

The system uses booking statuses such as:

PENDING
APPROVED
REJECTED
CONFIRMED
PENDING

Booking is awaiting administrative processing.

APPROVED

Admin has approved the booking.

REJECTED

Admin has rejected the booking.

CONFIRMED

Booking has reached the confirmed stage after the relevant payment/confirmation process.

🪪 Driving License

During booking, the customer provides driving-license information.

The booking stores:

private String licenseFileName;

The current implementation supports collecting the document information for administrative review.

Important limitation

The backend does not automatically determine whether a license is fake or genuine.

Automatic verification would require an additional service such as:

OCR
   +
Document Verification
   +
Identity Verification

📍 Pickup Location

Booking supports detailed pickup-location information.

Fields include:

pickupAddress
pickupLocality
pickupCity
pickupDistrict
pickupState
pickupPincode
pickupLatitude
pickupLongitude

This allows the system to store:

Readable Address
+
Geographical Coordinates

🗺️ Google Maps

The frontend uses Google Maps functionality for pickup-location selection/search.

The backend stores the resulting location information:

Address
Latitude
Longitude

Google Maps API configuration is separate from the Spring Boot booking business logic.

💳 Payment System

The backend contains a dedicated Payment entity.

Payment fields include:

id
amount
paymentMethod
paymentStatus
razorpayOrderId
razorpayPaymentId
razorpaySignature
upiTransactionId
paymentDate
booking

🔗 Payment → Booking

Payment has a One-to-One relationship with Booking.

@OneToOne
@JoinColumn(
    name = "booking_id",
    nullable = false
)
private Booking booking;

Architecture:

Booking
   │
   │ 1 : 1
   ▼
Payment

💰 Razorpay Payment Flow

Customer
    ↓
Booking
    ↓
Create Razorpay Order
    ↓
Razorpay Checkout
    ↓
Customer Payment
    ↓
Payment Verification
    ↓
Save Payment
    ↓
Update Booking
    ↓
Payment Success Email

💳 Payment Status

The Payment entity supports statuses such as:

CREATED
PAID
FAILED
REFUNDED

📚 Payment Repository

Important repository methods:

Payment findByBookingId(
        Long bookingId
);
Payment findByRazorpayOrderId(
        String razorpayOrderId
);
Payment findByRazorpayPaymentId(
        String razorpayPaymentId
);

Customer payment history:

List<Payment>
findByBookingCustomerIdAndPaymentStatusIgnoreCaseOrderByPaymentDateDesc(
        Long customerId,
        String paymentStatus
);

📧 Email Notifications

Email functionality is handled by the backend.

Important services:

RegistrationOtpService.java
ForgotPasswordService.java
BookingService.java
PaymentService.java
Registration OTP
Customer Registration
        ↓
RegistrationOtpService
        ↓
Generate OTP
        ↓
Send Email
        ↓
Customer Verification
Forgot Password
Forgot Password
       ↓
ForgotPasswordService
       ↓
Generate OTP / Reset Process
       ↓
Email
Booking Email

Booking-related notifications are handled from:

BookingService.java
Payment Success Email

Payment-success notification is handled from:

PaymentService.java

The important flow is:

PaymentPage
    ↓
Payment API
    ↓
PaymentService
    ↓
Verify Payment
    ↓
Save Payment
    ↓
sendPaymentSuccessEmail(...)
    ↓
Customer Email

⭐ Review System

The Review entity contains:

id
rating
review
reviewDate
customer
carVariant

Reviews are connected to both:

Customer

and:

CarVariant

🔎 Review Repository

Reviews can be retrieved by car variant:

List<Review> findByCarVariantId(
        Long carVariantId
);

Reviews can also be retrieved by customer:

List<Review> findByCustomerId(
        Long customerId
);

This supports:

Car Reviews
Customer Review History
Admin Review Management

👨‍💼 Admin Management

The Admin entity contains administrator information.

The project was expanded to support:

Name
Email
Password
Phone Number
Aadhaar Number
Address

Admin functionality includes:

Car Management
Booking Management
Customer Management
Payment Monitoring
Review Management
Availability Management

🗂️ Repository Layer

CarRepository
findFirstByCarVariantIdAndAvailableTrue()


countByCarVariantIdAndAvailableTrue()


existsByRegistrationNumber()


existsByRegistrationNumberAndIdNot()


countByCarVariantId()
BookingRepository
countByBookingStatus()


existsByCarId()

existsByCarId() is useful when checking whether a physical vehicle is referenced by a booking.

PaymentRepository
findByBookingId()


findByRazorpayOrderId()


findByRazorpayPaymentId()


findByBookingCustomerIdAndPaymentStatusIgnoreCaseOrderByPaymentDateDesc()
ReviewRepository
findByCarVariantId()


findByCustomerId()
AdminRepository
findByEmail()

🔌 REST API

The backend exposes REST APIs through Spring Boot controllers.

Examples from the car-management functionality:

Car APIs
POST   /car/add
GET    /car/all
PUT    /car/update/{id}
DELETE /car/delete/{id}
PUT    /car/availability/{id}
Car Variant APIs
POST /variant/add
GET  /variant/all

The exact endpoint list should always be checked against the current controller classes in the repository before relying on it as API documentation.

✅ Validation

The backend validates important business rules before saving records.

For example, adding a physical car:

Car exists
    ↓
Registration number exists
    ↓
Normalize registration number
    ↓
Check duplicate
    ↓
CarVariant exists
    ↓
Connect CarVariant
    ↓
Set available = true
    ↓
Save

This prevents invalid vehicle records.

❌ Error Handling

The backend returns meaningful error responses when validation or business logic fails.

A typical response structure is:

{
  "success": false,
  "message": "Error message"
}

The React frontend can use this response to display appropriate messages to users.

🗃️ Database Relationships

Simplified database architecture:

                 CarCompany
                     │
                     │
                     ▼
                 CarVariant
                 /         \
                /           \
               ▼             ▼
             Car           Review
              │               │
              │               │
              ▼               ▼
           Booking ◄────── Customer
              │
              │
              ▼
           Payment

More specifically:

CarCompany 1 ──────── * CarVariant


CarVariant 1 ──────── * Car


Customer 1 ────────── * Booking


Customer 1 ────────── * Review


CarVariant 1 ──────── * Review


CarVariant 1 ──────── * Booking


Car 1 ─────────────── * Booking


Booking 1 ─────────── 1 Payment

🧹 Test Data Management

During development, test data was removed through MySQL.

Because the database contains relationships, deleting records requires consideration of foreign keys.

For example:

Payment
   ↓
Booking

Therefore deleting a Booking while a Payment still references it may cause a foreign-key constraint error.

Similarly:

Review
   ↓
Customer

and:

Car
   ↓
CarVariant

must be considered before deleting parent records.

📊 Availability SQL Example

To inspect total and available vehicles:

SELECT
    cv.id,
    cv.variant_name,
    cv.price_per_day,
    COUNT(c.id) AS total_cars,
    SUM(
        CASE
            WHEN c.available = TRUE
            THEN 1
            ELSE 0
        END
    ) AS available_cars
FROM car_variant cv
LEFT JOIN car c
    ON c.car_variant_id = cv.id
GROUP BY
    cv.id,
    cv.variant_name,
    cv.price_per_day
ORDER BY cv.id;

This is useful for debugging differences between:

Admin → Manage Cars

and:

Home → Available Cars

⚙️ Configuration

Backend configuration is located at:

src/main/resources/application.properties

Typical database configuration:

spring.datasource.url=jdbc:mysql://localhost:3306/car_rental_system
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

Your actual configuration may differ.

🔐 Security and Secrets

Never commit sensitive credentials to GitHub.

Do not expose:

Database passwords
Email passwords
Razorpay secret keys
Google Maps private keys
API secrets
JWT secrets

Use environment variables or secure deployment configuration.

Example:

spring.datasource.password=${DB_PASSWORD}

▶️ How to Run

Prerequisites

Install:

Java JDK
Maven
MySQL
Git
1. Clone Repository
git clone https://github.com/Aaryan-Nandan/CarRental.com.git
2. Open Backend
cd CarRental.com/backend/backend

Or open the backend project in IntelliJ IDEA.

3. Create Database

Example:

CREATE DATABASE car_rental_system;
4. Configure Database

Open:

src/main/resources/application.properties

Configure:

spring.datasource.url=jdbc:mysql://localhost:3306/car_rental_system
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
5. Build Project
mvn clean install
6. Start Backend
mvn spring-boot:run

Or run:

BackendApplication.java

from IntelliJ IDEA.

🌐 Frontend Integration

The React frontend communicates with this backend through REST APIs.

React
localhost:3000
       │
       │ HTTP
       ▼
Spring Boot
configured backend port
       │
       ▼
MySQL

The frontend API base URL must match the backend server port configured in:

application.properties

🔄 CORS

During local development, the backend must allow requests from the React frontend.

Typical development origin:

http://localhost:3000

If the frontend uses a different port or deployment URL, CORS configuration must be updated accordingly.

🧠 Important Business Logic

CarVariant vs Car

This is one of the most important concepts in the backend.

CarVariant = Model / Type
Car        = Physical Vehicle

Example:

MG ZS EV
   │
   ├── BR01AA1234
   ├── DL04BB5678
   └── MH12CC9012

The system can therefore manage multiple physical vehicles under one variant.

📈 Availability Logic

Suppose:

Creta

has:

Total cars = 6
Available cars = 4

The backend calculates:

countByCarVariantIdAndAvailableTrue()

and returns:

4

The frontend should display the backend value rather than a hard-coded number.

🔗 Booking and Physical Vehicle

A customer initially selects:

CarVariant

The booking can later be associated with:

Actual Car

This allows the admin to assign a particular physical vehicle.

Customer
    ↓
CarVariant
    ↓
Booking
    ↓
Admin
    ↓
Actual Car
    ↓
Registration Number

📧 Notification Architecture

Registration
     ↓
RegistrationOtpService
     ↓
OTP Email




Forgot Password
     ↓
ForgotPasswordService
     ↓
Reset/OTP Email




Booking
     ↓
BookingService
     ↓
Booking Email




Payment
     ↓
PaymentService
     ↓
Payment Success Email

⚠️ Current Limitations

The current project should not claim functionality that has not been implemented.

Driving License

There is no automatic fake-license detection.

Authentication

Do not describe the project as JWT-secured unless JWT is actually implemented in the current repository.

Availability

Basic physical-car availability exists, but advanced rental date-overlap availability should be implemented if you want the system to prevent every possible overlapping booking scenario.

Deployment

The README should not claim production deployment unless the backend is actually deployed.

🚀 Future Improvements

Authentication
JWT authentication
Role-based authorization
Refresh tokens
Password hashing
Account lockout
Booking
Date-overlap checking
Automatic car allocation
Booking cancellation
Refund management
Booking expiry
Rental extension
Driving License
OCR
License-number extraction
Expiry validation
Document authenticity verification
Payment
Razorpay webhooks
Automatic refunds
Payment reconciliation
Payment retry
Backend Quality
DTOs
Bean Validation
Global exception handler
Pagination
Sorting
Swagger/OpenAPI
Unit tests
Integration tests
Deployment
Docker
CI/CD
Cloud deployment
Production database
Monitoring and logging

🔐 Security Recommendations

For production:

Password
   ↓
BCrypt / Argon2
   ↓
Database

Never store passwords in plain text.

Sensitive configuration should use:

Environment Variables
        ↓
Spring Boot
        ↓
Application

rather than hard-coded credentials.

🧪 Testing Strategy

Recommended backend tests:

Unit Tests
    ↓
Service Tests
    ↓
Repository Tests
    ↓
Controller Tests
    ↓
Integration Tests

Important test cases:

Car
Add car
Duplicate registration number
Update car
Delete car
Toggle availability
Booking
Valid booking
Invalid dates
Missing customer
Missing car variant
Booking status update
Payment
Order creation
Successful payment
Failed payment
Payment verification
Payment history
Review
Create review
Find reviews by variant
Find reviews by customer
🔧 Git and GitHub Workflow

The project contains both frontend and backend inside the same Git repository:

CarRental.com
│
├── frontend
│
└── backend

Frontend development can be done using VS Code and backend development using IntelliJ IDEA.

Both belong to the same Git repository.

🔄 Git Rebase Issue Encountered

During development, the local branch and remote branch diverged.

The situation was:

Local main
   ├── 3 local commits
   │
Remote main
   └── 1 different remote commit

Uncommitted backend files initially prevented:

git pull --rebase

The solution was to stash local changes first.

git stash

Then:

git fetch origin

Then:

git pull --rebase origin main

Finally:

git push origin main

The final result was:

Your branch is up to date with 'origin/main'.


nothing to commit, working tree clean

🚫 Do Not Force Push

Avoid:

git push --force

unless you completely understand the consequences.

When remote commits exist:

fetch
  ↓
review
  ↓
rebase/merge
  ↓
push

is safer.

📦 target/classes

The following directory contains generated compiled files:

backend/target/classes/

Examples:

Admin.class
BookingService.class
PaymentService.class

These are generated build artifacts.

Normally they should not be committed to GitHub.

Add Maven build output to .gitignore:

target/

🔍 Important Backend Files

File	Responsibility
Admin.java	Admin entity
Booking.java	Booking entity
Payment.java	Payment entity
Review.java	Review entity
Car.java	Physical vehicle entity
CarVariant.java	Vehicle variant entity
CarService.java	Car business logic
CarVariantService.java	Variant business logic
BookingService.java	Booking business logic
PaymentService.java	Payment + payment email
RegistrationOtpService.java	Registration OTP
ForgotPasswordService.java	Forgot password
CarRepository.java	Car database operations
BookingRepository.java	Booking database operations
PaymentRepository.java	Payment database operations
ReviewRepository.java	Review database operations
application.properties	Backend configuration

n numbers and individual availability. The booking module connects customers, car variants and actual cars.

I implemented payment processing using Razorpay, with a Payment entity having a one-to-one relationship with Booking. After successful payment verification, the backend stores the payment information and sends a payment-success email.

I also implemented OTP-based registration, forgot-password functionality, booking notifications, customer reviews, admin management and vehicle availability management.

o you prevent duplicate registration numbers?

Using:

existsByRegistrationNumber()

and for updates:

existsByRegistrationNumberAndIdNot()
Where is the payment-success email implemented?

In:

PaymentService.java

The service calls:

sendPaymentSuccessEmail(...)

after successful payment processing.

How does React communicate with Spring Boot?

React sends HTTP requests to Spring Boot REST APIs.

React
 ↓
HTTP Request
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
MySQL
Why use Spring Data JPA?

It reduces boilerplate database code and provides repository methods such as:

findById()
save()
findAll()
deleteById()

as well as derived query methods such as:

findByCustomerId()
📌 Important Design Decisions
1. Separate physical cars from variants

Improves fleet management.

2. Database-driven availability

Avoids hard-coded frontend counts.

3. Dedicated Payment entity

Keeps payment information separate from booking information.

4. Service layer

Keeps business logic outside controllers.

5. Repository abstraction

Keeps database access separate from business logic.

6. Backend email handling

Keeps sensitive email/payment logic away from the React frontend.

🚀 Roadmap
Current
  │
  ├── Car Management
  ├── Booking
  ├── Payment
  ├── Reviews
  ├── Admin
  ├── OTP
  └── Email
       │
       ▼
Next
  │
  ├── JWT Authentication
  ├── DTO Architecture
  ├── Global Exception Handling
  ├── Booking Date-Overlap Validation
  ├── License Verification
  ├── Payment Webhooks
  ├── Swagger
  └── Automated Tests
       │
       ▼
Production
  │
  ├── Docker
  ├── CI/CD
  ├── Cloud Deployment
  ├── Monitoring
  └── Production Database
👨‍💻 Developer

Aaryan Nandan

B.Tech — Computer Science & Engineering
Specialization — Artificial Intelligence & Machine Learning

Technical Skills
Java
C++
Python
Spring Boot
Spring Data JPA
Hibernate
React.js
MySQL
SQL
HTML
CSS
Git
GitHub
REST APIs
📄 License

This project was developed for educational, portfolio and learning purposes











# 🚀 Car Rental System - Backend

This is the backend of the Car Rental System developed using Spring Boot.

## 🛠️ Technologies Used

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- JWT Authentication
- Maven

## 📁 Project Structure

```
backend
│
├── src
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

## ▶️ Run the Project

```bash
mvn spring-boot:run
```

or run the project directly from IntelliJ IDEA.

Backend URL:

```
http://localhost:8081
```

## 🗄️ Database

Update the database configuration in:

```
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/car_rental
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

## 📌 API

The backend provides REST APIs for:

- User Authentication
- Car Management
- Booking Management
- Customer Management
- Admin Dashboard

## 👨‍💻 Author

Aaryan Nandan
