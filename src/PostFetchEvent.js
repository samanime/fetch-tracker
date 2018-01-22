/**
 * @augments Event
 * @param {Request} request
 * @param {Response} response
 * @param {number} duration
 * @constructor
 */
const PostFetchEvent = function(request, response, duration) {
  return Object.assign(new Event('postFetch'), { request, response, duration });
};

PostFetchEvent.prototype = Event.prototype;
PostFetchEvent.prototype.constructor = PostFetchEvent;

export default PostFetchEvent;