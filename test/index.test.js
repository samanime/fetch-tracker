/* global test, expect, beforeEach */
import '../src';

const URL = 'http://example.com';
const DELAY = 100;

const listenTo = name => new Promise(resolve => {
  addEventListener(name, e => { resolve(e); });
});

beforeEach(() => {
  global.fetch.__reset();
});

test('dispatches preFetch and postFetch', () => Promise.all([
  listenTo('preFetch').then(() => true),
  listenTo('postFetch').then(() => true),
  fetch(URL)
]).then(([preFetchCalled, postFetchCalled, response]) => {
  expect(preFetchCalled).toBe(true);
  expect(postFetchCalled).toBe(true);
  expect(response instanceof Response).toBe(true);

  expect(fetch.__lastRequest instanceof Request).toBe(true);
  expect(fetch.__lastRequest.url).toBe(URL);
}));

test('does not dispatch when tracking is paused', () => {
  const init = {};

  let preFetchCalled = false;
  let postFetchCalled = false;

  listenTo('preFetch').then(() => { preFetchCalled = true; });
  listenTo('postFetch').then(() => { postFetchCalled = true; });

  fetch.pauseTracking();
  return fetch(URL, init).then(response => {
    expect(preFetchCalled).toBe(false);
    expect(postFetchCalled).toBe(false);
    expect(response instanceof Response).toBe(true);

    expect(fetch.__lastRequest instanceof Request).toBe(false);
    expect(fetch.__lastRequest).toBe(URL);
    expect(fetch.__lastInit).toBe(init);
  });
});

test('resumes tracking after pausing', () => {
  fetch.pauseTracking();
  fetch.resumeTracking();
  Promise.all([
    listenTo('preFetch').then(() => true),
    listenTo('postFetch').then(() => true),
    fetch(URL)
  ]).then(([preFetchCalled, postFetchCalled, response]) => {
    expect(preFetchCalled).toBe(true);
    expect(postFetchCalled).toBe(true);
    expect(response instanceof Response).toBe(true);

    expect(fetch.__lastRequest instanceof Request).toBe(true);
    expect(fetch.__lastRequest.url).toBe(URL);
  });
});

test('gives a cloned request for preFetch', () => Promise.all([
  listenTo('preFetch'),
  fetch(URL)
]).then(([event, ]) => {
  expect(fetch.__lastRequest instanceof Request).toBe(true);
  expect(event.request instanceof Request).toBe(true);
  expect(fetch.__lastRequest).not.toBe(event.request);
  expect(fetch.__lastRequest).toEqual(event.request);
}));

test('gives a cloned request and response for postFetch', () => Promise.all([
  listenTo('postFetch'),
  fetch(URL)
]).then(([event, response]) => {
  expect(fetch.__lastRequest instanceof Request).toBe(true);
  expect(event.request instanceof Request).toBe(true);
  expect(fetch.__lastRequest).not.toBe(event.request);
  expect(fetch.__lastRequest).toEqual(event.request);

  expect(response instanceof Response).toBe(true);
  expect(event.response instanceof Response).toBe(true);
  expect(response).not.toBe(event.response);
  expect(response).toEqual(event.response);
}));

test('gives a different cloned request in preFetch and postFetch', () => Promise.all([
  listenTo('preFetch'),
  listenTo('postFetch'),
  fetch(URL)
]).then(([preEvent, postEvent, ]) => {
  expect(preEvent.request instanceof Request).toBe(true);
  expect(postEvent.request instanceof Request).toBe(true);
  expect(preEvent.request).not.toBe(postEvent.request);
  expect(preEvent.request).toEqual(postEvent.request);
}));

test('gives a proper duration', () => {
  global.fetch.__delay = DELAY;
  return Promise.all([
    listenTo('postFetch'),
    fetch(URL)
  ]).then(([event, ]) => {
    expect(event.duration).toBeGreaterThanOrEqual(DELAY);
    expect(event.duration).toBeLessThanOrEqual(DELAY + 1);
  });
});

test('trackingPaused to work properly', () => {
  expect(global.fetch.trackingPaused).toBe(false);
  global.fetch.pauseTracking();
  expect(global.fetch.trackingPaused).toBe(true);
  global.fetch.resumeTracking();
  expect(global.fetch.trackingPaused).toBe(false);
});