# Status Management Application

This is a web application for managing and updating the statuses of various services in real-time. It leverages WebSocket for real-time communication and RESTful APIs for CRUD operations related to service statuses. The application also supports user authentication with roles, providing different access levels for admins and regular users.

## Features

- **Real-Time Updates**: Uses WebSocket to receive real-time updates for service statuses.
- **Role-Based Access Control**:
    - **Admins** can create, update, and delete service statuses.
    - **Regular users** can view statuses but cannot make changes.
- **CRUD Operations**:
    - Create a new status for a service.
    - Update the status of existing services.
    - Delete a service status.
- **Responsive UI**: Built with Tailwind CSS for a clean and responsive user interface.

## Technologies

- **React**: Frontend framework for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **WebSocket**: For real-time communication to receive updates on service statuses.
- **Clerk**: For user authentication and role management.
- **Node.js**: Backend server handling API requests and WebSocket connections.

## Installation

To install LookOut, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/AmitChinara/LookOut.git
    cd LookOut
    ```

2. Navigate to the frontend directory and install dependencies:
    ```sh
    cd frontend
    npm install
    # or
    yarn install
    ```

3. Navigate to the backend directory and install dependencies:
    ```sh
    cd ../backend
    npm install
    # or
    yarn install
    ```

## Usage

To run the application locally, follow these steps:

1. Start the backend server:
    ```sh
    cd backend
    npm start
    # or
    yarn start
    ```

2. Start the frontend development server:
    ```sh
    cd ../frontend
    npm run dev
    # or
    yarn dev
    ```

3. Open your browser and navigate to `http://localhost:5173/` to see the application in action.

## How It Works

The **Status Management Application** is designed to manage service statuses in real-time with both WebSocket and RESTful communication. Here’s an overview of how the key components interact:

### 1. **WebSocket Connection**
   - When the application loads, a WebSocket connection is established between the frontend (React) and the backend (Node.js server).
   - The WebSocket URL `ws://localhost:2722/api/v1/status/getStatus` is used to send and receive data between the server and the client in real-time.
   - **Events Handled**:
     - **`INITIAL_LOAD`**: When the WebSocket connection is established, the server sends a list of all available services with their current statuses to the frontend. This is handled by the `ws.onmessage` event handler, and the state is updated to display the initial list of services.
     - **`STATUS_UPDATED`**: When the status of any service is updated (either by the admin or through some other process), this event is triggered. The frontend receives the updated service and applies the new status to the relevant service row in the UI.
     - **`SERVICE_CREATED`**: When a new service status is created via an admin action (like submitting the "Create Status" form), this event is triggered, and the new service status is added to the list.
     - **`SERVICE_DELETED`**: If a service is deleted, either by an admin or some other mechanism, this event is sent to the client, and the corresponding service status is removed from the displayed list.

### 2. **Role-Based UI (Admin vs Regular User)**
   - The **admin** role has full access to the system and can:
     - **Create new status**: Admins can create a new status by providing the name of the service and their name (as the creator) via a form.
     - **Update existing statuses**: Admins can change the status of a service by selecting a new status from a dropdown menu (such as "Operational", "Degraded Performance", etc.).
     - **Delete a status**: Admins can select a status to delete by clicking a radio button and then pressing the "Delete Selected Status" button.
   - **Regular users** are only able to:
     - **View the statuses** of services, but cannot update or delete them.
   - The application checks the user's role using Clerk authentication, where the `isAdmin` flag determines the level of access granted to the user.

### 3. **Managing Service Statuses**
   - **Creating a New Status**:
     - Admins can create a new status for a service by submitting a form with the service name and the name of the person who created it.
     - When the form is submitted, a POST request is made to the backend (`/createStatus`), and upon success, a WebSocket event (`SERVICE_CREATED`) is triggered to notify all clients of the new service.
   - **Updating a Status**:
     - Admins can update the status of an existing service by selecting a new status from a dropdown menu. The available options are:
       - `Operational`
       - `Degraded Performance`
       - `Partial Outage`
       - `Major Outage`
     - When a new status is selected, a PUT request is made to the backend (`/updateStatus`) to persist the change. The WebSocket event (`STATUS_UPDATED`) will then be triggered to notify all clients of the update.
   - **Deleting a Status**:
     - Admins can delete a service by selecting the service using the radio button and clicking the "Delete Selected Status" button. This triggers a DELETE request (`/deleteStatus`) to remove the status from the backend. A WebSocket event (`SERVICE_DELETED`) is then sent to remove the status from all client-side displays.

### 4. **State Management (React)**
   - The frontend uses React's `useState` and `useEffect` hooks to manage and update the state:
     - `messages`: Holds the list of service statuses that will be rendered in the table. Initially, this is populated with data from the WebSocket message event (`INITIAL_LOAD`).
     - `selectedId`: Holds the ID of the service status that is selected for deletion. This is updated when a user clicks on a radio button in the table.
   - Whenever a status is updated or a service is created or deleted, the React state is updated accordingly, and the UI re-renders to reflect the changes in real time.

### 5. **API Endpoints**
   - The backend provides the following API endpoints to manage the statuses:
     - **GET `/api/v1/status`**: Fetches the list of all service statuses.
     - **POST `/api/v1/status/createStatus`**: Creates a new service status.
     - **PUT `/api/v1/status/updateStatus`**: Updates the status of a service.
     - **DELETE `/api/v1/status/deleteStatus`**: Deletes a service status.

   - The frontend interacts with these API endpoints using `fetch` for sending requests. For example:
     - To update a status, the `handleStatusChange` function sends a `PUT` request to the `/updateStatus` API endpoint.
     - To create a new status, the `handleCreateStatus` function sends a `POST` request to the `/createStatus` endpoint.
     - To delete a status, the `handleDeleteStatus` function sends a `DELETE` request to the `/deleteStatus` endpoint.

### 6. **Real-Time Communication**
   - Real-time communication between the frontend and backend is handled via WebSocket. This allows the app to receive updates as soon as any status change occurs on the backend, ensuring that the client is always up to date with the latest data without needing to refresh the page.
   - The WebSocket connection is established on component mount using the `useEffect` hook, and it is closed when the component is unmounted to clean up resources.

### 7. **User Authentication**
   - The app uses **Clerk** for user authentication and role management.
   - Based on the role assigned to the user (either `org:admin` or a regular user), the UI is rendered accordingly:
     - Admins see options to create, update, and delete statuses.
     - Regular users can only view the service statuses and cannot make any changes.

---

This system ensures that service statuses can be easily monitored and updated in real-time, with clear separation between the actions available to admins and regular users.


#HOSTED LINK: https://lookout-frontend-5vfs.onrender.com/
