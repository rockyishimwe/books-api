# Books API

A RESTful API for managing books, built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

## Project Structure

```text
books-api/
|-- models/
|   `-- Book.js          # Mongoose Book schema and model
|-- routes/
|   `-- books.js         # All /api/books route handlers
|-- .env                 # Environment variables, not committed
|-- .gitignore
|-- package.json
|-- server.js            # Entry point: Express app and MongoDB connection
`-- README.md
```

## Setup

### 1. Prerequisites

- Node.js v16+
- MongoDB running locally, or a MongoDB Atlas connection string

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file in the project root and add:

```env
PORT=5005
MONGO_URI=mongodb://localhost:27017/booksdb
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/booksdb
```

### 4. Start the server

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## API Endpoints

Base URL: `http://localhost:5005`

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| POST   | `/api/books`     | Add a new book      |
| GET    | `/api/books`     | Get all books       |
| GET    | `/api/books/:id` | Get a book by ID    |
| PUT    | `/api/books/:id` | Update a book by ID |
| DELETE | `/api/books/:id` | Delete a book by ID |

## Book Schema

| Field  | Type   | Required | Notes                    |
|--------|--------|----------|--------------------------|
| title  | String | Yes      | Trimmed                  |
| author | String | Yes      | Trimmed                  |
| price  | Number | Yes      | Must be greater than 0   |

Mongoose automatically adds `createdAt` and `updatedAt` timestamps.

## Example Requests

### POST `/api/books`

```bash
curl -X POST http://localhost:5005/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The Alchemist", "author": "Paulo Coelho", "price": 12.99}'
```

### GET `/api/books`

```bash
curl http://localhost:5005/api/books
```

### GET `/api/books/:id`

```bash
curl http://localhost:5005/api/books/64f1a2b3c4d5e6f7a8b9c0d1
```

### PUT `/api/books/:id`

```bash
curl -X PUT http://localhost:5005/api/books/64f1a2b3c4d5e6f7a8b9c0d1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Book", "author": "Updated Author", "price": 9.99}'
```

### DELETE `/api/books/:id`

```bash
curl -X DELETE http://localhost:5005/api/books/64f1a2b3c4d5e6f7a8b9c0d1
```

## Error Responses

| Status | Meaning                    |
|--------|----------------------------|
| 400    | Validation failed          |
| 404    | Book or route not found    |
| 500    | Internal server error      |
