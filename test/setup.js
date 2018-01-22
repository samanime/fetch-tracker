/* global jest */
import 'whatwg-fetch';

global.fetch = jest.fn((request, init) => new Promise((resolve) => {
  global.fetch.__lastRequest = request;
  global.fetch.__lastInit = init;

  setTimeout(() => {
    resolve(new global.Response());
  }, global.fetch.__delay || 0);
}));

global.fetch.__reset = () => {
  global.fetch.mockClear();
  delete global.fetch.__delay;
  delete global.fetch.__lastRequest;
  delete global.fetch.__lastInit;
};