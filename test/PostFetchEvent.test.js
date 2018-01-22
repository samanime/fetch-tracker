/* global test, expect */
import PostFetchEvent from '../src/PostFetchEvent';

test('instanceof Event', () => {
  expect((new PostFetchEvent()) instanceof Event).toBe(true);
});

test('has postFetch type', () => {
  expect((new PostFetchEvent()).type).toBe('postFetch');
});

test('has proper constructor', () => {
  expect((new PostFetchEvent()).constructor).toBe(PostFetchEvent);
});

test('sets properties', () => {
  const request = new Request();
  const response = new Response();
  const duration = 100;
  const event = new PostFetchEvent(request, response, duration);

  expect(event.request).toBe(request);
  expect(event.response).toBe(response);
  expect(event.duration).toBe(duration);
});