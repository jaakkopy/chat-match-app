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
- [Material UI](https://mui.com/): Used to create a good looking and responsive UI.

## Other
- [Docker](https://www.docker.com/): Used mainly for making the testing and deployment of the application easier (avoid bothersome manual installations and configurations)

# Installation, setup, and running guide
## Environment variable files
For both of the cases listed below (docker or without), `.env` files need to be created.
1. From the root a the project, `cd` into `server`, and create a file called `.env` with the following keys (*the values are just for example, but they work for testing purposes*):
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=salasana
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=match
JWT_SECRET="123abc"
```
2. From the root, `cd` into `client` and create a file called `.env` with the following keys (*the values are the default values that work without modifications*):
```
REACT_APP_PROTOCOL="http"
REACT_APP_SERVER_HOST="localhost:8000"
```

## Using Docker
If you don't want to install anything (besides Docker and docker-compose), you can use Docker with docker-compose. On the root of the project, you can just run the following command to build and run the containers (the database and the app):
```
docker-compose up -d --build
```
When done, the containers can be removed with:
```
docker-compose down
```

## Without Docker
If you don't have Docker or don't want to use it, the following steps should be done to install and set up everything:

**Install Node.js**:
- Node version 18 was used. 
- You can install Node 18 with [nvm](https://github.com/nvm-sh/nvm): `nvm install 18`

**client setup**:
1. `cd` into `client` 
2. Run `npm install`
3. Run `npm run build`

**database setup**:
1. Install PostgreSQL for your system
2. Create a database
3. From the root of the project, run the initialization script: `psql -U <postgres user> -d <database name> < init.sql`

**server setup**:
1. `cd` into `server`
2. Run `npm install`
3. Run `npm run tsc` to build the server

If everything was set up correctly, and the database is running, you can run the project:
- **Development mode**: In the `client` directory, run `npm start`, and in the `server` directory, run `npm run dev`. The UI should be accessible from http://localhost:3000
- **Production mode**: In the `server` directory, run `npm run start`. The UI should be accessible from http://localhost:8000

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
When trying out the app, if you don't want to manually create users to try out all the features, you can run the `insert-demo-users.ts` script from the `server` directory to create some demo users.
```
NODE_ENV=<'production' or 'test' depending on which DB you wish to insert to> npx ts-node ./insert-demo-users.ts
```

**Using the app**:
- Starting the app:
    1. Start the app with either of the methods described above
    2. Use your browser to navigate to the address of the server. The default on the production mode is http://localhost:8000.
- Registration:
    1. If not logged in, the first view is the login view. To register, on mobile you can click the icon on the top left, and select "register". On a wider screen device the "register" link button is on the top right.
    2. Enter valid information and click the register button. Upon successful registration, you will be redirected to the login page.
- Login:
    1. Navigate to the login view.
    2. Enter the credentials and login.
- Navigation:
    1. On mobile the navigation drawer opens from the hamburger button on the top left.
    2. On a wider screen environment, the navigation links are shown on the top right.
- Matches view:
    1. In the "matches" view the user will be presented with a list of the users that the user has liked, and who have liked the user.
    2. Each user has an icon with their credentials and the latest message from the chat between the users is shown. By clicking on the entry, the user will be taken to the chat view with the target user.
- Chat view:
    1. In the chat view, users can type messages and press "send". The user's messages appear on the right and the target's on the left.
    2. If both users are online and chatting with each other, the other user's messages will appear on the left side.
- Browse view:
    1. To find more users to like, the user can click on the "browse" link on the UI.
    2. This will take them to a view where they can either like or dislike other users. On mobile, in addition to the buttons, liking and disliking can be done with swiping. Swiping left means "dislike" and swiping right means "like".
    3. If the user likes a user that has liked them, they can start chatting right away. The user will be directed to the chat view with the liked user.
- My Profile view:
    1. The "My Profile" view is a simple view where the name and birthdate of the user is shown.
    2. The profile text, which is shown to other users, can be edited.