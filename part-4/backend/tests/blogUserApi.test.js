const { describe, test, after, beforeEach } = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./testHelper');
const app = require('../app');
const bcrypt = require('bcryptjs');
const api = supertest(app);

const User = require('../models/user');

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash, name: 'root' });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  describe('restrictions to creating new users', () => {
    test('username must be given and must be at least 3 characters long', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'salainen',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert(response.body.error.includes('must be 3 or more characters'));

      const newUserNoUsername = {
        username: '',
        name: 'Matti Luukkainen',
        password: 'salainen',
      };

      const responseNoUsername = await api
        .post('/api/users')
        .send(newUserNoUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert(responseNoUsername.body.error.includes('Username is required'));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('password must be given and must be at least 3 characters long', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'sa',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert(
        response.body.error.includes('must be at least 3 characters long')
      );

      const newUserNoPassword = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: '',
      };

      const responseNoPassword = await api
        .post('/api/users')
        .send(newUserNoPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert(
        responseNoPassword.body.error.includes(
          'must be at least 3 characters long'
        )
      );

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('name must be given', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'mluukkai',
        name: '',
        password: 'salainen',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert(response.body.error.includes('Name is required'));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
