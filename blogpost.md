# Realtime communication with Server Sent Events

Where information is critical you would want to know the newest data as soon as possible. Instead of requiring the user to refresh the page, new information could be append to the page in a blink of an eye. For example a dashboard for flight/train departures or arrivals. Monitoring health equipment, like a heart rate monitor. Visualising data like current traffic jams, or news feeds.  

This is where realtime communication fits into view. Realtime methods currently available in modern browsers are [Websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket), [WEBRTC(P2P)](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) and [Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events). Each technique has its own use case.

## Server Sent What?
Server Sent Events(SSE, a.k.a Eventsource) is used to create a persistent mono-directional streaming method from the server to the client. If user input isn’t needed, than SSE is the preferred solution. This minimises overhead compared to using Websockets, which is bi-directional.

Features of using SSE

  - Server to client
  - Text-based 
  - Auto reconnect
  - Low latency
  - Native supported in modern browser ([pollyfill](https://github.com/remy/polyfills/blob/master/EventSource.js) for IE11, Edge)
  - Easily implemented
  - No third party’s library’s

## Tell me again why you wouldn’t use Websockets?
It depends on the use case of the application. For example if it is necessary to send and receive data in realtime, than Websockets is the go to tool, but if your application only needs to show information, than I would opt for SSE even though you could also achieve this with Websockets. 

SSE houses a reconnection functionality which Websockets doesn’t do out of the box. There are library’s that provide this functionality like [Socket.io](https://socket.io/) and [SockJS](https://github.com/sockjs), but this would require to implement a framework, which again is not needed in implementing SSE.

There are features lacking in SSE that Websockets do support like binary transfers. So for example you would want to send an image server side to the client. As an image is stored as binary data, sending the image with SSE is a bit tricky but possible by using the encoding method base64. This would  create extra overhead. An alternative could be, to send the URI of the image to the client and fetching it with the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) asynchronously which would result in an extra roundtrip to the server, but should be of no hindrance to the user. Then the fetched asset could leverage caching and compression, which a streamed asset can’t.

## What is the difference with Push API?
This is the new player in town which has the functionality of also pushing information from the server to the client. Yet it is harder to implement than SSE and relies on third party members like Firebase or OneSingle.  It still has lower support than SSE but this is subject to change in the future. Push API works on a long lived connection, which still works when the application is closed, while SSE only is a persistent connection when the page is opened. Then again Push API needs a service worker to push data from the server to the client, while SSE works without service workers.

## So how do I let my application know that there is new data?

### Server side
Start by adding an endpoint on the server that accept the text/event-stream header. 

SSE expects your data to be in a specific [format](). 

It will only accept strings so if you would want to send an object, JSON stringify would be the function to use.

By adding a listener on the server that checks the database on changes and then invoking to send the SSE would be the preferred method, but in the example the application invokes the function on a timed interval. This would illustrate the functionality well enough.

code voorbeelden.

### Client side
First thing to do on the client side is defining an object that points to the server sent event endpoint. 

After that add the onmessage function, which listens to any changes on the sse endpoint.

Once data arrives in the browser it should be parsed to be converted to an object.
And than you application logic can take care of the rest.

code voorbeelden.

Clone this repository if you would like to see SSE and Fetch API in action.

## Conclude
Maybe the question that should be answer is does the user send a lot of messages and also needs to receive them in realtime. You would think a typical example is a chat system, but most users in a chat might not even send a message and are just observing the chat. Therefore a Websocket connection could become overkill. And it would be interesting to read research about an experiment with a lot of concurrent users where one group would be using Websockets and the other a combination of server sent events and asynchronously push requests. I would be curious to see which group would experience the least amount of latency.

I would opt using server sent events, depending on what the goal of the application is. This might sound like an obvious statement but still I feel people jump easier on the Websocket bandwagon, while SSE could be a more fitting solution to their project. I think SSE could have some prime time in the limelight. 

Additional links to resources:

[eventsource hpbn api](https://hpbn.co/server-sent-events-sse/#eventsource-api)

[sse streamdata.io](https://streamdata.io/blog/server-sent-events/)

[mdn using sse](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)

[websockets vs http2](https://www.infoq.com/articles/websocket-and-http2-coexist)

[sse fastly blogpost](https://www.fastly.com/blog/server-sent-events-fastly/)

[whatwg sse](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events)
