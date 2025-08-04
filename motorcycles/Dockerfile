# ===================================
# DOCKERFILE ULTRA SIMPLE - SOLO COPIA JAR
# ===================================

FROM openjdk:17-jdk-slim

WORKDIR /app

# Copiar SOLO el JAR compilado (debe existir)
COPY target/motorcycles-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]