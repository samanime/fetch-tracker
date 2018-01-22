import PreFetchEvent from './PreFetchEvent';
import PostFetchEvent from './PostFetchEvent';

let trackingPaused = false;
const realFetch = fetch;

fetch = (input, init) => {
  if (trackingPaused) {
    return realFetch(input, init);
  }

  const request = new Request(input, init);
  const startTime = Date.now();

  dispatchEvent(new PreFetchEvent(request.clone()));

  return realFetch(request)
    .then(response => {
      dispatchEvent(new PostFetchEvent(request.clone(), response.clone(), Date.now() - startTime));

      return response;
    });
};

Object.assign(fetch, realFetch, {
  /**
   * Pauses tracking, prevents preFetch and postFetch from dispatching.
   */
  pauseTracking: () => {
    trackingPaused = true;
  },
  /**
   * Resumes tracking after pauseTracking.
   */
  resumeTracking: () => {
    trackingPaused = false;
  }
});

Object.defineProperties(fetch, {
  trackingPaused: {
    get: () => trackingPaused
  }
});