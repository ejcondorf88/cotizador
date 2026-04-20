FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the application JAR
COPY target/ms-gateway-*.jar app.jar

# Expose the gateway port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
