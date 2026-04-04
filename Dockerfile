FROM maven:3.8.3-openjdk-17 AS build

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests


FROM amazoncorretto:17

WORKDIR /apl

COPY --from=build /app/target/*.jar /apl/app.jar

RUN mkdir -p /apl/files /apl/tmp \
    && ln -sf /usr/share/zoneinfo/America/Bogota /etc/localtime \
    && useradd -m appuser

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-Dlog4j2.formatMsgNoLookups=true", "-jar", "/apl/app.jar"]

CMD ["--spring.servlet.multipart.location=/apl/tmp"]