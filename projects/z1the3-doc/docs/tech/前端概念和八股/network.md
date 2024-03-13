# 计算机网络

## OSI 七层模型

- 应用层
- 表示层
- 会话层
- 传输层
- 网络层
- 数据链路层
- 物理层

## TCP/IP 五层协议

- 应用层（应用层，表示层，会话层
- 传输层
- 网络层
- 数据链路层
- 物理层

## 301 和 302

301（永久性转移）
请求的网页已被永久移动到新位置。服务器返回此响应时，会自动将请求者转到新位置。

302（暂时性转移）
服务器目前正从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。此代码与响应 GET 和 HEAD 请求的 301 代码类似，会自动将请求者转到不同的位置。

## 队头阻塞

Q: 什么是队头阻塞？

A: 队头阻塞分以下两种：

- TCP 队头阻塞：TCP 数据包是有序传输，中间一个数据包丢失，会等待该数据包重传，造成后面的数据包的阻塞。

- HTTP 队头阻塞：HTTP 遵守“请求-响应”的模式，也就是客户端每次发送一个请求到服务端，服务端返回响应。但有一个致命缺陷那就是页面中有多个请求，每个请求必须等到前一个请求响应之后才能发送，并且当前请求的响应返回之后，当前请求的下一个请求才能发送。此时如果有一个请求响应慢了，会造成后面的响应都延迟。
  为了提高速度和效率，在持久连接的基础上，HTTP1.1 进一步地支持在持久连接上使用管道化（pipelining）特性。管道化允许客户端在已发送的请求收到服务端的响应之前发送下一个请求，借此来减少等待时间提高吞吐，如果多个请求能在同一个 TCP 分节发送的话，还能提高网络利用率。
  同一个 tcp 连接中可以同时发送多个 http 请求，也就是并发，但是在响应的时候，必须排队响应，谁先到达的谁先响应，相比不支持管道化的 http 请求确实提高了效率，但是还是有局限性，加入其中某个响应因为某种原因延迟了几秒，后面的响应都会被阻塞。

## TCP 和 UDP

TCP: 收发数据前必须和对方建立可靠的连接，建立连接的 3 次握手、断开连接的 4 次挥手，为数据传输打下可靠基础。
面向连接，是可靠服务，传输比较慢，报文格式面向字节流，常见场景网页、邮件。
当网络出现拥塞的时候，TCP 能够减小向网络注入数据的速率和数量，缓解拥塞。另外有流量控制

UDP: 是一个面向无连接的协议，数据传输前，源端和终端不建立连接，发送端尽可能快的将数据扔到网络上，接收端从消息队列中读取消息段。
面向无连接，可靠性不保证，传输快，报文格式面向数据包，常见场景语音广播

## SSE 和 Websocket

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

|SSE|Websocket|
|SSE 则是部署在 HTTP 协议之上的，现有的服务器软件都支持。|WebSocket 是一个新的协议，需要服务器端支持|
|SSE 是一个轻量级协议，相对简单|WebSocket 是一种较重的协议，相对复杂。|
|SSE 需要自己处理跨域请求|Websocket 默认支持跨域|
|SSE 协议默认支持断线重连。|Websocket 需要利用第三方库或者自己实现断线重连|

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

### Websocket

WebSocket 是 HTML5 定义的一个新协议，与传统的 http 协议不同，该协议可以实现服务器与客户端之间全双工通信。参数传递中的 ws://前缀类似于 http://，用于进行协议的声明
简单来说，首先需要在客户端和服务器端建立起一个连接，这部分需要 http。连接一旦建立，客户端和服务器端就处于平等的地位，可以相互发送数据，不存在请求和响应的区别。

WebSocket 提供了四个事件操作，如下：
onmessage 收到服务器响应时执行
onerror 出现异常时执行
onopen 建立起连接时执行
onclose 断开连接时执行

#### Websocket 怎么建立连接

#### 1.心跳包的意义

在使用 websocket 的过程中，有时候会遇到网络断开的情况，但是在网络断开的时候服务器端并没有触发 onclose 的事件。
这样会有：服务器会继续向客户端发送多余的链接，并且这些数据还会丢失。
所以就需要一种机制来检测客户端和服务端是否处于正常的链接状态。
因此就有了 websocket 的心跳了，还有心跳，说明还活着，没有心跳说明已经挂掉了。

#### 2、实现心跳检测的思路

通过 setInterval 定时任务每个 3 秒钟调用一次 reconnect 函数
reconnect 会通过 socket.readyState 来判断这个 websocket 连接是否正常
如果不正常就会触发定时连接，每 4s 钟重试一次，直到连接成功
如果是网络断开的情况下，在指定的时间内服务器端并没有返回心跳响应消息，因此服务器端断开了。
服务断开我们使用 ws.close 关闭连接，在一段时间后，可以通过 onclose 事件监听到

## TCP 的 Keepalive 和 HTTP 的 Keep-Alive 是一个东西吗？

事实上，这两个完全是两样不同东西，实现的层面也不同：
HTTP 的 Keep-Alive，是由应用层（用户态） 实现的，称为 HTTP 长连接；
TCP 的 Keepalive，是由 TCP 层（内核态） 实现的，称为 TCP 保活机制；

### HTTP 的 Keep-Alive

解决每次 HTTP 连接都要进行一次 TCP 三次握手连接

HTTP keepalive 指的是持久连接，强调复用 TCP 连接。（类似场景：挂电话之前总会问句，没啥事就先挂了，延长通话时长来确认没有新话题）

HTTP 的 Keep-Alive 就是实现了这个功能，可以使用同一个 TCP 连接来发送和接收多个 HTTP 请求/应答，避免了连接建立和释放的开销，这个方法称为 HTTP 长连接

HTTP 协议采用的是「请求-应答」的模式，也就是客户端发起了请求，服务端才会返回响应，一来一回这样子。

### TCP 的 Keep-Alive(保活机制)

连接建立之后，如果客户端一直不发送数据，或者隔很长时间才发送一次数据，当连接很久没有数据报文传输时如何去确定对方还在线，到底是掉线了还是确实没有数据传输，连接还需不需要保持，这种情况在 TCP 协议设计中是需要考虑到的。
TCP 协议通过一种巧妙的方式去解决这个问题，当超过一段时间之后，TCP 自动发送一个数据为空的报文（侦测包）给对方，如果对方回应了这个报文，说明对方还在线，连接可以继续保持，如果对方没有报文返回，并且重试了多次之后则认为链接丢失，没有必要保持连接。

## TCP 拥塞控制

TCP 协议有两个比较重要的控制算法，一个是流量控制，另一个就是阻塞控制。

TCP 协议通过滑动窗口来进行流量控制，它是控制发送方的发送速度从而使接受者来得及接收并处理。而拥塞控制是作用于网络，它是防止过多的包被发送到网络中，避免出现网络负载过大，网络拥塞的情况。

拥塞控制主要是四个算法：1）慢启动，2）拥塞避免，3）拥塞发生，4）快速恢复

### 慢热启动算法 – Slow Start

所谓慢启动，也就是 TCP 连接刚建立，一点一点地提速，试探一下网络的承受能力，以免直接扰乱了网络通道的秩序。

慢启动算法：

1. 连接建好的开始先初始化拥塞窗口 cwnd 大小为 1，表明可以传一个 MSS 大小的数据。
2. 每当收到一个 ACK，cwnd 大小加一，呈线性上升。
3. 每当过了一个往返延迟时间 RTT(Round-Trip Time)，cwnd 大小直接翻倍，乘以 2，呈指数让升。
4. 还有一个 ssthresh（slow start threshold），是一个上限，当 cwnd >= ssthresh 时，就会进入“拥塞避免算法”（后面会说这个算法）

### 拥塞避免算法 – Congestion Avoidance

如同前边说的，当拥塞窗口大小 cwnd 大于等于慢启动阈值 ssthresh 后，就进入拥塞避免算法。算法如下：

1. 收到一个 ACK，则 cwnd = cwnd + 1

2. 每当过了一个往返延迟时间 RTT，cwnd 大小加一。

过了慢启动阈值后，拥塞避免算法可以避免窗口增长过快导致窗口拥塞，而是缓慢的增加调整到网络的最佳值。

### 拥塞发生（快重传）

超时重传 RTO[Retransmission Timeout]超时，或者收到三个重复确认 ACK 时

执行快重传
cwnd 大小缩小为当前的一半
ssthresh 设置为缩小后的 cwnd 大小
然后进入快速恢复算法 Fast Recovery。

### 快速恢复

重传 DACKs 指定的数据包。
如果再收到 DACKs，那么 cwnd 大小增加一。
如果收到新的 ACK，表明重传的包成功了，那么退出快速恢复算法。将 cwnd 设置为 ssthresh，然后进入拥塞避免算法。

## 短轮询

短轮询的基本思路就是浏览器每隔一段时间向服务器发送 http 请求，通过让客户端不断的进行请求，使得客户端能够模拟实时地收到服务器端的数据的变化
由于需要不断的建立 http 连接，严重浪费了服务器端和客户端的资源

## comet -长轮询

comet 指的是，当服务器收到客户端发来的请求后，不会直接进行响应，而是先将这个请求挂起，然后判断服务器端数据是否有更新。如果有更新，则进行响应，如果一直没有更新，则到达一定的时间限制（服务器端设置）后关闭连接。
长轮询和短轮询比起来，明显减少了很多不必要的 http 请求次数，相比之下节约了资源。长轮询的缺点在于，连接挂起也会导致资源的浪费。
