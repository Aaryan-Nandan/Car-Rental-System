# 🚗 Car Rental System

A Full Stack Car Rental System developed using **Spring Boot**, **React.js**, and **MySQL**.

## 📂 Project Structure

```
Car-Rental-System
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── mvnw
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## 🚀 Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Browse Car Variants
- ✅ Book Cars
- ✅ Upload Driving License
- ✅ Admin Dashboard
- ✅ Approve / Reject Booking
- ✅ MySQL Database
- ✅ Responsive UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Bootstrap

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- REST API
- JWT Authentication

### Database
- MySQL

---

## 📁 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Application runs at:

```
http://localhost:3000
```

---

## 📁 Backend Setup

```bash
cd backend
```

Run the Spring Boot application from IntelliJ IDEA

or

```bash
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

---

## 🗄️ Database

- MySQL
- Database Name: car_rental

Update the following file:

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

## 👨‍💻 Author

**Aaryan Nandan**

GitHub:
https://github.com/Aaryan-Nandan
