# About
- An app where users can browse other users, like them and dislike them.
- The users who have liked each other can chat in real time and send messages even if the other user is offline.
- The app is based on the standard client/server model.

# Technology choices
## Server
- [Express](https://expressjs.com/): Used to implement the server. Chosen for for its ease of use and its comptability with other node packages.
- [Jest](https://jestjs.io/): Used for testing. Chosen due to familiarity with the framework, and its good documentation.
- [TypeScript](https://www.typescriptlang.org/): Used because of personal preference for types.
- [Passport](https://www.passportjs.org/): Used to implement authentication with JWTs.
- [Node-postgres](https://node-postgres.com/): Used to handle a connection to a PostgreSQL database. PostgreSQL was selected due to familiarity, because it allows for easy creation of triggers, and because the database schema is well defined for this app.
- [WS](https://www.npmjs.com/package/ws): A websocket library used to implement the real time chat.
- [Express validator](https://express-validator.github.io/docs): Used to to validate requests.

## Client
- [React](https://react.dev/): Used for creating the UI.
- [react-swipeable](react-swipeable): A module which allows for detection of a swipe event with mobile users. Used for implementing a swipe like/dislike when browsing other users.
- [react-use-websocket](https://www.npmjs.com/package/react-use-websocket): A module that makes it easier to set up a websocket connection in a React app. Used in the chat component.
- TypeScript was used to build the client side as well.
- [react-router-dom](https://www.npmjs.com/package/react-router-dom): Used to implement routing.

## Other
- [Docker](https://www.docker.com/): Used mainly for making the testing and deployment of the application easier (avoid bothersome manual installations and configurations)

# Installation and setup guide
For both cases listed below, `.env` files need to be created.
1. In the root a the project, create a file called `.env` with the following entries:
```

```

## Using Docker
If you don't want to install anything, you can use Docker with docker-compose. On the root of the project, you can just run the following command to build and run the containers:
```
docker-compose up -d --build
```
When done, the containers can be stopped and removed via the Docker CLI.

## Without Docker
If you don't have Docker or don't want to use it, the following steps should be done to install and set up everything:

**client setup**:
1. From the root of the project, run the following: `cd client`.
2. ... todo

# Testing guide
Some tests have been implemented for the server. During development, the tests were ran using a separate Docker container. Other ways work as well, but the following guide is for using the container approach:
1. On the root of the project, there is a script `create-postgres-container.sh` that you can use. It creates a container and initializes it with the `init.sql` script.
    - For example: `./create-postgres-container.sh postgres-test-db 5555 password` creates a container with the name 'postgres-test-db', sets it to expose the port 5555, and uses 'password' as the password.
2. Change the working directory to the server: `cd server`. If dependencies are not installed yet, please install them with `npm install`.
3. In the root of the `server` directory, create a `.env.test` for example with the following entries (change the example values to whichever you chose to use):
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
POSTGRES_DATABASE=match
JWT_SECRET="123abc"
```
4. Run the test command: `npm run test`.


# User manual