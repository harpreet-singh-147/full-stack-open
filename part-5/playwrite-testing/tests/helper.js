const { expect } = require('@playwright/test');

const registerUser = async (request, name, username, password) => {
  await request.post('/api/users', {
    data: {
      name,
      username,
      password,
    },
  });
};

const loginWith = async (page, username, password) => {
  await page.getByTestId('usernameInput').fill(username);
  await page.getByTestId('passwordInput').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click();
  await page.getByTestId('titleInput').fill(title);
  await page.getByTestId('authorInput').fill(author);
  await page.getByTestId('urlInput').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
};

const likeBlog = async (page, text, length) => {
  const blog = page.locator('.blog__content').filter({ hasText: text });

  await blog.getByRole('button', { name: 'view' }).click();

  for (let i = 0; i < length; i++) {
    await blog.getByRole('button', { name: 'like' }).click();

    const expectedLikes = i + 1;
    await expect(blog.locator('.blog__likes')).toHaveText(
      `${expectedLikes} like`
    );
  }
};

export { registerUser, loginWith, createBlog, likeBlog };
