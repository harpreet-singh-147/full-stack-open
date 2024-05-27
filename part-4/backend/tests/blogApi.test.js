const { describe, test, after, beforeEach } = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./testHelper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

const createUserAndLogin = async () => {
  const newUser = {
    username: process.env.TEST_USERNAME,
    name: process.env.TEST_NAME,
    password: process.env.TEST_PASSWORD,
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const token = loginResponse.body.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  return { token, decodedToken };
};

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    await User.deleteMany({});
  });

  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('correct length of blogs', async () => {
    const res = await api.get('/api/blogs');
    assert.strictEqual(res.body.length, helper.initialBlogs.length);
  });

  test('a specific blog is returned within the response', async () => {
    const { body } = await api.get('/api/blogs');
    const contents = body.map(blog => blog.title);
    assert(contents.includes('Go To Statement Considered Harmful'));
  });

  test('verify unique identifier property of blog posts is named id', async () => {
    const { body: blogs } = await api.get('/api/blogs');
    for (const blog of blogs) {
      assert.strictEqual('id' in blog, true);
      assert.strictEqual('_id' in blog, false);
    }
  });

  describe('viewing a specific blog', () => {
    test('succeeds with valid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const res = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(res.body, blogToView);
    });

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445';
      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const { token, decodedToken } = await createUserAndLogin();

      const newBlog = {
        title: 'test blog from test file',
        author: 'test author',
        url: 'https://fullstackopen.com/',
        userId: decodedToken.id,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const contents = blogsAtEnd.map(blog => blog.title);
      assert(contents.includes('test blog from test file'));
    });
  });

  describe('blog fails with the proper status code', () => {
    test('401 Unauthorized if a token is not provided', async () => {
      const { decodedToken } = await createUserAndLogin();

      const newBlog = {
        title: 'test blog from test file',
        author: 'test author',
        url: 'https://fullstackopen.com/',
        userId: decodedToken.id,
      };

      const res = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(res.body.error, 'Unauthorized');
    });
  });

  describe('missing properties', () => {
    test('verify if likes property is missing from the request, it will default to 0', async () => {
      const { token, decodedToken } = await createUserAndLogin();

      const newBlogWithNoLikeProperty = {
        title: 'No likes',
        author: 'No likes',
        url: 'https://fullstackopen.com/',
        userId: decodedToken.id,
      };

      const { body } = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithNoLikeProperty)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(body.likes, 0);
    });

    test('verify if title missing from the request data, backend responds with status code 400', async () => {
      const { token, decodedToken } = await createUserAndLogin();

      const newBlogWithNoTitleProperty = {
        author: 'No title property',
        url: 'https://fullstackopen.com/',
        userId: decodedToken.id,
      };

      const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithNoTitleProperty)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(res.status, 400);
    });

    test('verify if url missing from the request data, backend responds with status code 400', async () => {
      const { token, decodedToken } = await createUserAndLogin();

      const newBlogWithNoUrlProperty = {
        title: 'No author property',
        author: 'Some author',
        userId: decodedToken.id,
      };

      const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithNoUrlProperty)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(res.status, 400);
    });
  });

  describe('updating a blog', () => {
    test('updating the information of an individual blog post', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const { id, title, author, url, likes } = blogsAtStart[0];

      const updatedBlog = {
        title,
        author,
        url,
        likes: likes + 1,
      };

      const res = await api
        .put(`/api/blogs/${id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(res.body.likes, likes + 1);
      assert.strictEqual(res.body.title, title);
      assert.strictEqual(res.body.author, author);
      assert.strictEqual(res.body.url, url);
    });
  });

  describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const { token, decodedToken } = await createUserAndLogin();

      const newBlog = {
        title: 'test blog from test file',
        author: 'test author',
        url: 'https://fullstackopen.com/',
        userId: decodedToken.id,
      };

      const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      await api
        .delete(`/api/blogs/${res.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

      const contents = blogsAtEnd.map(blog => blog.title);
      assert(!contents.includes(newBlog.title));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
