# Lead Management System

A **Lead Management System** built with **Express.js** and **TypeScript**, containerized using **Docker**.  
The project uses **Docker Compose** to orchestrate services including an Express.js backend and a MongoDB database.

---

## 🚀 Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your system  
  (Docker Compose comes bundled with Docker Desktop).

---


## ⚙️ Environment Setup

1. Create a new `.env` file in the **root folder** of the project.
2. Copy the contents of `.env.example` into `.env`.
3. Fill in the required fields (like database credentials, ports, secrets, etc.).

## 🛠️ Setup & Usage

The application is fully containerized, so you don’t need to install Node.js or MongoDB locally.

### Start the application
docker compose up -d --build

### stop the application
docker compose down

### stop the application and remove volume
docker compose down -v

## Features
- The backend is written in TypeScript to provide compile-time checks, reduce runtime bugs, and improve developer DX.
- All API inputs are validated and sanitized using Zod schemas before entering business logic.
- Every incoming request is validated and sanitized at the boundary, preventing malformed data from reaching the database or controllers
- All endpoints follow a unified response shape (success and error), making frontend integration predictable and simple.
- Files/folders organized to keep routes, controllers, models, validators, middlewares, and error handling separate and easy to navigate.
- A single error handling layer formats and logs errors consistently and returns structured error payloads to clients.
- Docker Compose brings up a consistent environment (Express + MongoDB) with a single command.