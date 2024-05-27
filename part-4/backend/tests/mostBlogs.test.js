const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/listHelper');

const { listWithOneBlog, blogs } = require('./data/testData');

describe('most blogs', () => {
  test('when the list is empty, returns null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null);
  });

  test('returns an object', () => {
    assert.strictEqual(typeof listHelper.mostBlogs(blogs), 'object');
  });

  test('when list has only one blog, returns the author of that blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });

  test('when the list has multiple blogs, the author with most blogs is found', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});
