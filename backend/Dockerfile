# Etapa 1: Compilación de la aplicación con Maven y Java 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Imagen ligera de ejecución con Java 17 JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV SERVER_PORT=8085
EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"]
