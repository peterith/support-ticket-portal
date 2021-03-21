# Support Ticket Portal

A customer support ticket portal for SaaS companies.

## Roadmap

- 1.0 - Minimum variable product
- 1.1 - Authentication and authorisation
- 1.2 - Filter, search, sort and pagination
- 1.3 - Comment

## Getting Started

### Requirements

- [npm](https://www.npmjs.com/)
- [Java](https://www.oracle.com/java/)
- [MySQL](https://www.mysql.com/)

### Installing

Installing the client:

```
cd client
npm install
npm start
```

Installing the server:

```
cd server
./mvnw spring-boot:run
```

## Running the tests

Running the tests for the client:

```
cd client
npm test
```

Running the tests for the server:

```
cd server
./mvnw test
```

## Deployment

Deploying the client:

```
cd client
npm install
npm run build
npx serve -s build
```

Deploying the server:

```
cd server
./mvnw clean package
cd target
java -jar ticket-tracking-server-x.y.z.jar # x.y.z is the build version
```

## Built With

- [React](https://reactjs.org/) - Frontend library
- [Spring](https://spring.io/) - Backend framework
