FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/service1-0.0.1-SNAPSHOT.jar app.jar
VOLUME ["/mnt/vstorage"]
EXPOSE 8199
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=8199"]
