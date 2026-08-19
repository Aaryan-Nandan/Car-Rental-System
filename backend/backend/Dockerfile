# =========================
# Build Stage
# =========================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven configuration first
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build Spring Boot application
RUN mvn clean package -DskipTests


# =========================
# Runtime Stage
# =========================
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy generated JAR
COPY --from=build /app/target/*.jar app.jar

# Render uses its PORT environment variable
EXPOSE 10000

# Start Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
