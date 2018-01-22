# Fetch Tracker

Wraps the `fetch` function so it can emit a few custom fetch events, useful for
tracking analytics from `fetch`.

The events are non-destructive and will not change anything about the fetch itself
(unlike the `FetchEvent` `fetch` event).

## Installation

Include before you call `fetch`, and it will be wrapped automatically.

**Important Note:** If you are using a `fetch` polyfill, you should include
this module *after* any polyfills or other `fetch` changing modules.

### ES6

    import 'fetch-tracker';
    
### Common JS

    require('fetch-tracker');
    
### Browser

Minified:

    <script href="path/to/fetch-tracker/dist/fetch-tracker.min.js"></script>
    
Unminified:
    
    <script href="path/to/fetch-tracker/dist/fetch-tracker.js"></script>
    
There are also accompanying maps `fetch-tracker.min.js.map` and `fetch-tracker.js.map`.

## Basic Usage

    addEventListener('preFetch', event => {
      console.log(event.request);
    });
    
    addEventListener('postFetch', event => {
      console.log(event.request, event.response, event.duration);
    });
    
    fetch('http://example.com');
    
Two events are available, `preFetch` and `postFetch`. Add an event listener for them
(at the top-level). They will be dispatched every time `fetch` is called (unless
paused with `fetch.pauseTracking()`).
    
## Properties

### fetch.trackingPaused

Boolean. Indicates if tracking has been paused.
    
## Methods

### fetch.pauseTracking()

Calling this will pause any tracking of `fetch`, so it will not emit `preFetch` or
`postFetch` events any more.

This is useful if you are going to make an especially large call that would perform
poorly when cloning the `Response` object.

### fetch.resumeTracking()

Resumes tracking after calling `fetch.pauseTracking()`.
    
## Events

### preFetch

This event is fired before the normal `fetch` event.

It will receive a `PreFetchEvent` event, which includes the `request`.
    
The `PreFetchEvent` has a `request` property which is a clone of the original `Request`.

    addEventListener('preFetch', event => {
      console.log(event.request.method);
    });

### postFetch

This event is fired once the `fetch` itself is complete, but before any `then()` functions
are fired from the fetch.

It will receive a `PostFetchEvent` event, which includes the following properties:

 - `request` - A clone of the original `Request` object.
 - `response` - A clone of the `Response` object.
 - `duration` - The time (in milliseconds) between the initiation of the fetch and when it concludes.
 
*Note:* If there are multiple `postFetch` events, they will share the same `response`, so
reading the `body` once will mean subsequent events can't be read. If you are doing this,
you should use `response.clone()` in at least one of those so you can read it multiple times
(or combine it into one event).

    addEventListener('postFetch', event => {
      event.response.json().then(json => console.log(json));
    });

### fetch

This event isn't implemented by this library, but if you are using a library/environment which
does use it, it occurs after `preFetch` but before `postFetch`. It is unaffected by
this library. [MDN FetchEvent Documentation](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent)