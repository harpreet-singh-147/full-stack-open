import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import blogService from '../services/blogs';

test('renders content', () => {
  const blog = {
    title: 'Vitest title',
    author: 'Vitest author',
  };

  const { container } = render(<Blog blog={blog} />);

  const div = container.querySelector('.blog__content');

  expect(div).toHaveTextContent('Vitest title');
  expect(div).toHaveTextContent('Vitest author');

  let element = screen.getByText('Vitest title');
  expect(element).toBeDefined();

  element = screen.getByText('Vitest author');
  expect(element).toBeDefined();

  const urlDiv = container.querySelector('.blog__url');
  const likesDiv = container.querySelector('.blog__likes');

  expect(urlDiv).toBeDefined();
  expect(likesDiv).toBeDefined();

  expect(urlDiv).toHaveTextContent('');
  expect(likesDiv).toHaveTextContent('like');
});

test("blog's URL and number of likes are shown when the button controlling the shown details has been clicked", async () => {
  const blog = {
    title: 'Vitest title',
    author: 'Vitest author',
    likes: 1,
    url: 'https://fullstackopen.com/',
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  expect(screen.getByText('https://fullstackopen.com/')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
});

test('clicking the like button twice calls updateLikes twice', async () => {
  const blog = {
    title: 'Vitest title',
    author: 'Vitest author',
    likes: 1,
    url: 'https://fullstackopen.com/',
  };

  const mockUpdateLikes = vi
    .spyOn(blogService, 'updateLikes')
    .mockResolvedValue({
      ...blog,
      likes: blog.likes + 1,
    });

  const setBlogs = vi.fn();
  const displayNotification = vi.fn();

  render(
    <Blog
      blog={blog}
      setBlogs={setBlogs}
      displayNotification={displayNotification}
    />
  );

  const user = userEvent.setup();
  const viewBtn = screen.getByText('view');
  await user.click(viewBtn);

  const likeBtn = screen.getByText('like');
  await user.click(likeBtn);
  await user.click(likeBtn);

  expect(mockUpdateLikes).toHaveBeenCalledTimes(2);

  mockUpdateLikes.mockRestore();
});
