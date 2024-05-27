const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/listHelper');

const { listWithOneBlog, blogs } = require('./data/testData');

describe('most likes', () => {
  test('when the list is empty, returns null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null);
  });

  test('returns an object', () => {
    assert.strictEqual(typeof listHelper.mostLikes(blogs), 'object');
  });

  test('when list has only one blog, returns the likes of that blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('when list has multiple blogs, finds the author with the most likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
