/**
 * @augments Event
 * @param {Request} request
 * @constructor
 */
const PreFetchEvent = function(request) {
  return Object.assign(new Event('preFetch'), { request });
};

PreFetchEvent.prototype = Event.prototype;
PreFetchEvent.prototype.constructor = PreFetchEvent;

export default PreFetchEvent;