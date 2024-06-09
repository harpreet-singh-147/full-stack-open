import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateBlog from './CreateBlog';
import blogService from '../services/blogs';

vi.mock('../services/blogs');

test.only('<CreateBlog /> calls onSubmit with the right details when a new blog is created', async () => {
  const mockSetBlogs = vi.fn();
  const mockDisplayNotification = vi.fn();

  const user = userEvent.setup();

  blogService.create.mockResolvedValue({
    title: 'testing blog form title',
    author: 'testing blog form author',
    url: 'testing blog form url',
  });

  render(
    <CreateBlog
      setBlogs={mockSetBlogs}
      displayNotification={mockDisplayNotification}
    />
  );

  const createBlogSubmitBtn = screen.getByText('create');

  const titleInput = screen.getByPlaceholderText('enter blog title');
  const authorInput = screen.getByPlaceholderText('enter blog author');
  const urlInput = screen.getByPlaceholderText('enter blog url');

  await user.type(titleInput, 'testing blog form title');
  await user.type(authorInput, 'testing blog form author');
  await user.type(urlInput, 'testing blog form url');

  await user.click(createBlogSubmitBtn);

  expect(blogService.create).toHaveBeenCalledWith({
    title: 'testing blog form title',
    author: 'testing blog form author',
    url: 'testing blog form url',
  });

  expect(mockSetBlogs).toHaveBeenCalledTimes(1);
  const updatedBlogs = mockSetBlogs.mock.calls[0][0]([]);

  expect(updatedBlogs).toEqual(
    expect.arrayContaining([
      {
        title: 'testing blog form title',
        author: 'testing blog form author',
        url: 'testing blog form url',
      },
    ])
  );

  expect(mockDisplayNotification).toHaveBeenCalledWith(
    'a new blog testing blog form title by testing blog form author added',
    'success'
  );
});
