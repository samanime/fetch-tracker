/* global test, expect */
import PreFetchEvent from '../src/PreFetchEvent';

test('instanceof Event', () => {
  expect((new PreFetchEvent()) instanceof Event).toBe(true);
});

test('has postFetch type', () => {
  expect((new PreFetchEvent()).type).toBe('preFetch');
});

test('has proper constructor', () => {
  expect((new PreFetchEvent()).constructor).toBe(PreFetchEvent);
});

test('sets request', () => {
  const request = {};
  expect((new PreFetchEvent(request)).request).toBe(request);
});