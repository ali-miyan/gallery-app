# GALLERY APP

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Contributing](#contributing)
- [License](#license)

## Features

This project is an image gallery application featuring user authentication with JWT for secure sign-up and sign-in processes. Built with React (Vite) on the frontend and Node.js (TypeScript) on the backend, it allows users to upload images in bulk, view, delete, edit, and reorder images via drag-and-drop. The application integrates a MongoDB database for managing user data and image storage, providing a robust and interactive platform for image management.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 20.0.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Installation

Clone the repository:

```bash
git clone 'https://github.com/ali-miyan/gallery-app.git'
cd gallery-app
```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Frontend

In the frontend directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.

### Backend

In the backend directory, you can run:

- `npm run dev`: Runs the server using nodemon for development.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm start`: Runs the compiled JavaScript server.

## Deployment

Example:
The application is deployed at: `https://gallery-app-liart.vercel.app`

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Frontend build tool
- [Node.js](https://nodejs.org/) - Backend runtime
- [TypeScript](https://www.typescriptlang.org/) - Programming language
