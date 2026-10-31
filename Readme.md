# ChatBuddy - OneStop place for personal interaction

ChatBuddy is a full-stack web application designed to facilitate personal interaction through real-time messaging. It provides users with a seamless experience to connect and communicate with each other. This README file serves as a guide to set up and run the application.

Live Deployed Link :- https://chat-buddy-with-socket-io.vercel.app/

## ChatBuddy UI
![ChatBuddy UI](https://github.com/AdityaGoel0320/MERN-CHAT-APP-WITH-SOCKET-IO/assets/112582770/88ae9a28-3ea9-44a7-a868-9c9179e6e690)


## Admin Page ScreenShot
![Admin Page ScreenShot](https://github.com/AdityaGoel0320/MERN-CHAT-APP-WITH-SOCKET-IO/assets/112582770/5dedddd9-3496-48ac-bd93-6333d10e0d43)


## Group Section
![Group Section ScreenShot](https://github.com/AdityaGoel0320/MERN-CHAT-APP-WITH-SOCKET-IO/assets/112582770/6d89d9e0-7ed8-4d25-8650-5b3f8f03e967)



<!-- [Watch the demo video](link_to_demo_video) -->

## Features

- **Real-time Messaging**: Utilizes Socket.io for instant messaging between users.
- **Image Storage**: Cloudinary integration for robust image storage and retrieval.
- **State Management**: Redux ensures proper state management throughout the application.
- **Admin Panel**: Includes an admin panel for managing users and content.

## Installation

To run ChatBuddy locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/AdityaGoel0320/MERN-CHAT-APP-WITH-SOCKET-IO.git
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   cd MERN-CHAT-APP-WITH-SOCKET-IO/frontend
   npm install
   cd ../backend
   npm install
   ```

3. Create a `.env` file in the backend directory and add the following configurations:

   ```plaintext
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.ffsn2re.mongodb.net/MernChatApp?retryWrites=true&w=majority
   JWT_SECRET=<your_jwt_secret_key>
   ADMIN_SECRET_KEY=<your_admin_secret_key>
   NODE_ENV=DEVELOPMENT
   CLIENT_URL=http://localhost:5173
   PORT=1111
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   ```

4. Create a `.env` file in the frontend directory and add the following configuration:

   ```plaintext
   VITE_SERVER=http://localhost:1111
   ```

5. Run the backend server:

   ```bash
   cd ../backend
   npm start
   ```

6. Run the frontend application:

   ```bash
   cd ../frontend
   npm run dev
   ```

7. Access ChatBuddy in your browser at `http://localhost:5173`.

## Usage

Once the application is up and running, users can sign up, log in, and start messaging with other users in real-time. The admin panel allows administrators to manage users and content efficiently.

## Updated Workspace

- Shared light and dark themes for the workspace and Material UI dialogs. The theme starts from your system preference and remembers your selection locally.
- Responsive conversation navigation, conversation filtering, touch-accessible chat actions, and a viewport-aware message composer.
- Updated authentication, group settings, profile, and admin navigation. Signup requires a profile photo; attachments are limited to five files, each at most 5 MB.
- Socket messages are authorized against database membership and saved before broadcasting. Failed delivery keeps the draft and reports the failure; presence supports multiple tabs.

Both directories include `.env.example` templates. Configure your own backend `.env` with MongoDB, Cloudinary, and unique JWT/admin secrets. `VITE_SERVER` controls the frontend API URL, `PORT` controls the backend listener, and `CLIENT_URL` accepts comma-separated allowed frontend origins. Keep the frontend hostname consistent when testing cookies. Set `NODE_ENV=PRODUCTION` on HTTPS deployments for cross-site secure cookies.

If port 5173 is occupied, use another frontend port and include its origin in `CLIENT_URL`. The template also allows `http://localhost:5175`.

The previously displayed admin key has been removed. Rotate any old admin key before deploying. Deploy the updated frontend and backend together because message delivery now uses Socket.IO acknowledgements.

## Verification

```bash
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix backend test
```

The socket tests use isolated in-memory dependencies, not your database. End-to-end signup, messaging, and attachment tests require a running backend with valid environment configuration. The existing lint gate still includes legacy prop-validation and unused-import violations; a successful build is not a clean lint report. Review `npm audit` separately before deployment: compatible fixes do not resolve all advisories in the older toolchain.

Live Deployed Link :- https://chat-buddy-with-socket-io.vercel.app/

## Technologies Used

- MongoDB
- Express.js
- React
- Node.js
- Cloudinary
- Socket.io
- Redux


---

© 2024 Aditya Goel. All Rights Reserved.

[website](https://aditya-goel-portfolio-website.vercel.app/) | [GitHub](https://github.com/AdityaGoel0320) | [LinkedIn](https://www.linkedin.com/in/aditya-goel-286245239/)
