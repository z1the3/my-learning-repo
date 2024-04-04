## SSE 和 Websocket

**SSE 不是 http2.0 服务端推送！！**

SSE 是 HTML5 新增的功能，全称为 Server-SentEvents。它可以允许服务推送数据到客户端。SSE 在本质上就与之前的长轮询、短轮询不同，虽然都是基于 http 协议的，但是轮询需要客户端先发送请求。
而 SSE 最大的特点就是不需要客户端发送请求，可以实现只要服务器端数据有更新，就可以马上发送到客户端。
SSE 的优势很明显，它不需要建立或保持大量的客户端发往服务器端的请求，节约了很多资源，提升应用性能。

SSE 适用于需要服务器向客户端单向实时推送数据的场景，例如实时更新的新闻、股票行情等。 优点：简单易用，对服务器压力小，浏览器兼容性好。 缺点：只支持单向通信，无法进行双向交互。 WebSocket 适用于需要客户端和服务器之间实时双向通信的场景，例如聊天室、实时协作应用等。

ChatGPT 利用 SSE 和 Event Source 实现流式传输

https://developer.mozilla.org/en-US/docs/Web/API/EventSource

An EventSource instance opens a persistent connection to an HTTP server, which sends events in text/event-stream format. The connection remains open until closed by calling EventSource.close().

SSE （ Server-sent Events ）是 WebSocket 的一种轻量代替方案，使用 HTTP 协议。

SSE 是一种服务器端到客户端(浏览器)的单向消息推送（半双工通信模式）。
严格地说，HTTP 协议是没有办法做服务器推送的，但是当服务器向客户端声明接下来要发送**流信息**时，**客户端就会保持连接打开**，SSE 使用的就是这种原理。

- 流信息
- 保持打开
  相比于 WebSocket，SSE 简单不少，服务器端和客户端工作量都要小不少、简单不少，同时实现的功能也有局限。

| SSE                                                      | Websocket                                      |
| -------------------------------------------------------- | ---------------------------------------------- |
| SSE 则是部署在 HTTP 协议之上的，现有的服务器软件都支持。 | WebSocket 是一个新的协议，需要服务器端支持     |
| SSE 是一个轻量级协议，相对简单                           | WebSocket 是一种较重的协议，相对复杂。         |
| SSE 需要自己处理跨域请求                                 | Websocket 默认支持跨域                         |
| SSE 协议默认支持断线重连。                               | Websocket 需要利用第三方库或者自己实现断线重连 |

### 哪些地方用到了 SSE？

同样的我们用 HMR 来看，市面已知的 HMR 的解决方案除了 webpack-dev-server 使用的 websocket 方案外，还有另一种解决方案就是 webpack-hot-middleware。

webpack-hot-middleware 就是使用的 SSE 来代替的 websocket 进行 webpack 编译通知。
下面看一下实现代码。

```js
function init() {
  // SSE 一般用 EventSource
  source = new window.EventSource(options.path);
  source.onopen = handleOnline;
  source.onerror = handleDisconnect;
  source.onmessage = handleMessage;
}

function handleOnline() {
  if (options.log) console.log("[HMR] connected");
  lastActivity = new Date();
}

function handleMessage(event) {
  lastActivity = new Date();
  for (var i = 0; i < listeners.length; i++) {
    listeners[i](event);
  }
}

function handleDisconnect() {
  clearInterval(timer);
  source.close();
  setTimeout(init, options.timeout);
}
```

### 实现一个 SSE

```js
const Koa = require("koa");
const app = new Koa();
const Router = require("@koa/router");
const router = new Router();
const PassThrough = require("stream").PassThrough;

// 往stream推入data
function sse(stream, event, data) {
  return stream.push(`event: ${event}
  data:${JSON.stringify(data)}\n\n`);
}

router.get("/", async (ctx) => {
  // 需要操作stream
  const stream = new PassThrough();
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  ctx.set("Content-Type", "text/event-stream;charset=utf-8");
  ctx.set("Connection", "keep-alive");
  ctx.set("Cache-Control", "no-cache");
  ctx.res.writeHead(200);
  ctx.body = stream;

  sse(stream, "test", { name: "zzr" });
  let i = 0;

  // 只是测一下
  setInterval(() => {
    sse(stream, "test", { name: "zzr", count: i++ });
  }, 1000);
});

app.use(router.routes()).use(router.allowedMethods()).listen(6789);
```
