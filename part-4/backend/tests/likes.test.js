const { test, describe } = require('node:test');
const assert = require('node:assert');

const listHelper = require('../utils/listHelper');
const { listWithOneBlog, blogs, mostLikedBlog } = require('./data/testData');

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 48);
  });
});

describe('most likes', () => {
  test('of empty list is zero', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), 0);
  });

  test('when list has only one blog equals that blog', () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog(listWithOneBlog),
      listWithOneBlog[0]
    );
  });

  test('return blog with most likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), mostLikedBlog);
  });
});
