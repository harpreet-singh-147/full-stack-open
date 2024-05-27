const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const totalLikes = blogs.reduce((total, blog) => total + blog.likes, 0);
  return blogs.length === 0 ? 0 : totalLikes;
};

const favoriteBlog = blogs => {
  return blogs.length === 0
    ? 0
    : blogs.reduce(
        (max, blog) => (blog.likes > max.likes ? blog : max),
        blogs[0]
      );
};

const mostBlogs = blogs => {
  const authorBlogCount = blogs.reduce((blogCountObj, blog) => {
    blogCountObj[blog.author] = (blogCountObj[blog.author] || 0) + 1;
    return blogCountObj;
  }, {});

  const topAuthor = Object.keys(authorBlogCount).reduce((top, author) => {
    if (!top || authorBlogCount[author] > authorBlogCount[top]) {
      top = author;
    }

    return top;
  }, null);

  return blogs.length === 0
    ? null
    : {
        author: topAuthor,
        blogs: authorBlogCount[topAuthor],
      };
};

const mostLikes = blogs => {
  const authorBlogLikesCount = blogs.reduce((blogLikesObj, blog) => {
    blogLikesObj[blog.author] = (blogLikesObj[blog.author] || 0) + blog.likes;

    return blogLikesObj;
  }, {});

  const topAuthor = Object.keys(authorBlogLikesCount).reduce((top, author) => {
    if (!top || authorBlogLikesCount[author] > authorBlogLikesCount[top]) {
      top = author;
    }

    return top;
  }, null);

  return blogs.length === 0
    ? null
    : {
        author: topAuthor,
        likes: authorBlogLikesCount[topAuthor],
      };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
