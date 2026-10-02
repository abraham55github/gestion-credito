# --- Etapa de build: compila el jar con el wrapper de Gradle del propio proyecto ---
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew

COPY src src
RUN ./gradlew bootJar --no-daemon -x test

# --- Etapa final: solo el JRE y el jar, imagen liviana ---
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=docker
EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]
