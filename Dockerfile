# Stage 1: Build
FROM maven:3.8.3-openjdk-17 AS build

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run — usa amazoncorretto igual que tu otro servicio
FROM amazoncorretto:17

WORKDIR /apl/

COPY --from=build /app/target/*.jar /apl/app.jar

RUN mkdir -p /apl/files/ /apl/tmp/ \
    && rm -f /etc/localtime \
    && ln -s /usr/share/zoneinfo/America/Bogota /etc/localtime \
    && echo 'alias ll="ls -lha"' >> ~/.bashrc

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTIONS -jar /apl/app.jar --spring.servlet.multipart.location=/apl/tmp -Dlog4j2.formatMsgNoLookups=true $JAR_OPTIONS"]