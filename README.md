# Project Name

## Stack

- MongoDB
- Express.js
- React
- Node.js

---

## Requirements

Before running the project, make sure you have the following installed:

- Node.js
- Docker (with Docker Compose)

---

## Installation

Install the project dependencies:

```bash
npm install
```

Start the frontend development:

```bash
cd Frontend
```

```bash
npm run dev
```

Start the backend development:

```bash
cd Backend
```

```bash
node server.js
```

---

## MongoDB Setup

1. Navigate to the directory containing the `docker-compose.yml` file.

2. Start the MongoDB container:

```bash
docker compose up -d
```

3. Verify that the container is running:

```bash
docker compose ps
```

MongoDB credentials (username and password) are already configured in the project's Docker Compose configuration.

---

If both the frontend and backend are included in the project, ensure the MongoDB container is running before starting the application.

---

## Stopping MongoDB

To stop the MongoDB container:

```bash
docker compose down
```

To stop and remove the database volume (this deletes all stored data):

```bash
docker compose down -v
```
