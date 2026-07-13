# 🚗 Car Rental System

A Full Stack Car Rental System developed using **Spring Boot**, **React.js**, and **MySQL**. The application allows customers to browse available cars, book vehicles online, and enables administrators to manage cars and bookings.

---

## 📂 Project Structure

```
Car-Rental-System
│
├── backend
│   ├── src
│   ├── pom.xml
│   ├── mvnw
│   └── ...
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ✨ Features

### 👤 Customer

- User Registration
- User Login (JWT Authentication)
- View Available Cars
- Book Cars
- Select Pickup and Return Date
- Upload Driving License
- View Booking Details

### 👨‍💼 Admin

- Admin Login
- Add Car Companies
- Add Car Variants
- Add Cars
- Manage Customers
- Approve or Reject Bookings
- Assign Cars to Customers

---

## 🛠 Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Bootstrap
- Axios

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- REST APIs
- JWT Authentication
- Maven

### Database
- MySQL

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Aaryan-Nandan/Car-Rental-System.git
```

---

## ▶️ Run Backend

```bash
cd backend
```

Open the project in IntelliJ IDEA and run the Spring Boot application.

Backend URL:

```
http://localhost:8081
```

---

## ▶️ Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend URL:

```
http://localhost:3000
```

---

## 🗄 Database Configuration

Configure MySQL in:

```
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/car_rental
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

---

## 📸 Project Modules

- Authentication
- Customer Management
- Car Company Management
- Car Variant Management
- Car Booking
- Admin Dashboard
- Booking Approval

---

## 📌 Future Improvements

- Online Payment Integration
- Email Notifications
- Booking History
- User Profile Management
- Responsive Mobile Design

---

## 👨‍💻 Author

**Aaryan Nandan**

GitHub: https://github.com/Aaryan-Nandan
