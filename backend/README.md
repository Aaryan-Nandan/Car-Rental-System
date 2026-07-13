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
