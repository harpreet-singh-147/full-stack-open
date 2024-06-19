const { test, expect, beforeEach, describe } = require('@playwright/test');
const { registerUser, loginWith, createBlog, likeBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await registerUser(request, 'test11', 'test11', 'test11');
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const heading = await page.getByRole('heading', {
      name: /log in to application/i,
    });
    await expect(heading).toBeVisible();

    const usernameInput = await page.getByTestId('usernameInput');
    await expect(usernameInput).toBeVisible();

    const passwordInput = await page.getByTestId('passwordInput');
    await expect(passwordInput).toBeVisible();

    const loginButton = await page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test11', 'test11');
      await expect(page.getByText('test11 logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('usernameInput').fill('test11');
      await page.getByTestId('passwordInput').fill('wrong');
      await page.getByRole('button', { name: 'login' }).click();

      const errorDiv = await page.locator('.error');
      await expect(errorDiv).toContainText('invalid username or password');
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');

      await expect(page.getByText('test11 logged in')).not.toBeVisible();
    });
  });

  describe('when logged in', () => {
    beforeEach(async ({ page, request }) => {
      await loginWith(page, 'test11', 'test11');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog created in the tests',
        'Goldie',
        'https://fullstackopen.com/'
      );
      const blogContent = await page
        .locator('.blog__content')
        .getByText('a blog created in the tests');
      await expect(blogContent).toBeVisible();
    });

    test('a new blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'a blog created in the tests',
        'Goldie',
        'https://fullstackopen.com/'
      );
      await page.getByRole('button', { name: 'view' }).click();
      await page.getByRole('button', { name: 'like' }).click();

      const blogContent = await page.locator('.blog__likes').getByText('1');
      await expect(blogContent).toBeVisible();
    });

    test('user who added the blog can delete the blog', async ({ page }) => {
      await createBlog(
        page,
        'a blog created in the tests',
        'Goldie',
        'https://fullstackopen.com/'
      );
      await page.getByRole('button', { name: 'view' }).click();

      let blogContent = await page
        .locator('.blog__content')
        .getByText('a blog created in the tests');
      await expect(blogContent).toBeVisible();

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click();

      blogContent = await page
        .locator('.blog__content')
        .getByText('a blog created in the tests');
      await expect(blogContent).not.toBeVisible();
    });

    test('only the user who created the blog post can see the remove button', async ({
      page,
      request,
    }) => {
      await createBlog(
        page,
        'a blog created in the tests',
        'Goldie',
        'https://fullstackopen.com/'
      );

      await page.getByRole('button', { name: 'view' }).click();
      const blogContent = await page
        .locator('.blog__content')
        .getByText('a blog created in the tests');
      const removeButton = await page.getByRole('button', { name: 'remove' });

      await expect(blogContent).toBeVisible();
      await expect(removeButton).toBeVisible();

      await page.getByRole('button', { name: 'logout' }).click();

      await registerUser(request, 'test12', 'test12', 'test12');
      await loginWith(page, 'test12', 'test12');

      await page.getByRole('button', { name: 'view' }).click();
      await expect(blogContent).toBeVisible();
      await expect(removeButton).not.toBeVisible();

      await page.getByRole('button', { name: 'logout' }).click();
      await loginWith(page, 'test11', 'test11');

      await page.getByRole('button', { name: 'view' }).click();
      await expect(blogContent).toBeVisible();
      await expect(removeButton).toBeVisible();
    });

    test('blogs are arranged in the order according to likes, the blog with the most likes first', async ({
      page,
    }) => {
      test.setTimeout(20000);

      await createBlog(
        page,
        'a blog created in the tests likes 1',
        'Goldie',
        'https://fullstackopen.com/'
      );

      await createBlog(
        page,
        'a blog created in the tests likes 2',
        'Goldie',
        'https://fullstackopen.com/'
      );

      await createBlog(
        page,
        'a blog created in the tests likes 3',
        'Goldie',
        'https://fullstackopen.com/'
      );

      await likeBlog(page, 'a blog created in the tests likes 1', 3);
      await likeBlog(page, 'a blog created in the tests likes 2', 2);
      await likeBlog(page, 'a blog created in the tests likes 3', 4);

      const blogs = page.locator('.blog__content');
      const blogCount = await blogs.count();

      const blogLikes = [];

      for (let i = 0; i < blogCount; i++) {
        const blog = blogs.nth(i);
        const likesText = await blog.locator('.blog__likes').textContent();
        const likes = parseInt(likesText);
        blogLikes.push({ likes });
      }

      blogLikes.sort((a, b) => b.likes - a.likes);

      for (let i = 0; i < blogCount - 1; i++) {
        const currentBlog = blogLikes[i];
        const nextBlog = blogLikes[i + 1];
        expect(currentBlog.likes).toBeGreaterThanOrEqual(nextBlog.likes);
      }
    });
  });
});
