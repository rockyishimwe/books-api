const assert = require('assert');
const mongoose = require('mongoose');
const { app, connectDB } = require('../server');

const request = async (baseUrl, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const body = await response.json().catch(() => null);
  return { response, body };
};

const run = async () => {
  await connectDB();

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  let createdBookId;

  try {
    const created = await request(baseUrl, '/api/books', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Book',
        author: 'Test Author',
        price: 19.99
      })
    });

    assert.strictEqual(created.response.status, 201);
    assert.strictEqual(created.body.title, 'Test Book');
    assert.strictEqual(created.body.author, 'Test Author');
    assert.strictEqual(created.body.price, 19.99);
    createdBookId = created.body._id;

    const allBooks = await request(baseUrl, '/api/books');
    assert.strictEqual(allBooks.response.status, 200);
    assert.ok(Array.isArray(allBooks.body));
    assert.ok(allBooks.body.some((book) => book._id === createdBookId));

    const oneBook = await request(baseUrl, `/api/books/${createdBookId}`);
    assert.strictEqual(oneBook.response.status, 200);
    assert.strictEqual(oneBook.body._id, createdBookId);

    const updated = await request(baseUrl, `/api/books/${createdBookId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Updated Test Book',
        author: 'Updated Author',
        price: 24.5
      })
    });

    assert.strictEqual(updated.response.status, 200);
    assert.strictEqual(updated.body.title, 'Updated Test Book');
    assert.strictEqual(updated.body.author, 'Updated Author');
    assert.strictEqual(updated.body.price, 24.5);

    const invalidId = await request(baseUrl, '/api/books/not-a-real-id');
    assert.strictEqual(invalidId.response.status, 404);

    const missingId = new mongoose.Types.ObjectId().toString();
    const missing = await request(baseUrl, `/api/books/${missingId}`);
    assert.strictEqual(missing.response.status, 404);

    const deleted = await request(baseUrl, `/api/books/${createdBookId}`, {
      method: 'DELETE'
    });
    assert.strictEqual(deleted.response.status, 200);
    assert.strictEqual(deleted.body.message, 'Book deleted successfully');

    const deletedAgain = await request(baseUrl, `/api/books/${createdBookId}`, {
      method: 'DELETE'
    });
    assert.strictEqual(deletedAgain.response.status, 404);

    console.log('All book API tests passed');
  } finally {
    if (createdBookId) {
      await mongoose.connection.db.collection('books').deleteOne({
        _id: new mongoose.Types.ObjectId(createdBookId)
      });
    }

    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
