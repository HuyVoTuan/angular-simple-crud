# My Angular CRUD Application

This repository contains a CRUD application with an Angular frontend and a Node.js backend. The Angular app uses Angular Material UI and interacts with the Node.js backend API to perform CRUD operations, sorting, and querying of records.

## Prerequisites

Before setting up the application, ensure you have the following installed on your local machine:

- **Node.js** (v16.x or higher)
- **npm** (Node Package Manager, comes with Node.js)
- **Angular CLI** (v15.x or higher)

## Getting Started

Follow these steps to set up and run the application locally.

### 1. Clone the Repository

```bash
git clone https://github.com/HuyVoTuan/angular-simple-crud.git

cd angular-simple-crud
```

### 2. Setup backend

```bash
cd nodejs-base-template
npm install or npm i

Since this is just a small exercise so hididng the database connection is not necessary
```

### 3. Start backend server

```bash
npm start

The backend server should now be running on http://localhost:3000.
```

### 4. Setup Angular

```bash
cd ../angular-items-app
npm install or npm i
```

### 4. Start Angular app

```bash
ng serve

Open your browser and navigate to http://localhost:4200 to access the Angular frontend.

Ensure the backend API is accessible at http://localhost:3000/api/items.
```
