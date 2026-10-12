# Production Dockerfile for CarePulse AI Spring Boot Backend on Render
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/carepulse-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
