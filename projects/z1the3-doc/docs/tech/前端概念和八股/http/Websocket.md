# Websocket

WebSocket 是 HTML5 支持的一个新协议，与传统的 http 协议不同，该协议可以实现服务器与客户端之间全双工通信。参数传递中的 ws://前缀类似于 http://，用于进行协议的声明
简单来说，首先需要在客户端和服务器端建立起一个连接，这部分需要 http。连接一旦建立，客户端和服务器端就处于平等的地位，可以相互发送数据，不存在请求和响应的区别。

WebSocket 提供了四个事件操作，如下：
onmessage 收到服务器响应时执行
onerror 出现异常时执行
onopen 建立起连接时执行
onclose 断开连接时执行

## 基于协议

并不完全算基于 http 协议？

所以应该是基于 TCP 协议

## Websocket 怎么建立连接

### 1.心跳包的意义

在使用 websocket 的过程中，有时候会遇到网络断开的情况，但是在网络断开的时候服务器端并没有触发 onclose 的事件。
这样会有：服务器会继续向客户端发送多余的链接，并且这些数据还会丢失。
所以就需要一种机制来检测客户端和服务端是否处于正常的链接状态。
因此就有了 websocket 的心跳了，还有心跳，说明还活着，没有心跳说明已经挂掉了。

### 2、实现心跳检测的思路

通过 setInterval 定时任务每个 3 秒钟调用一次 reconnect 函数
reconnect 会通过 socket.readyState 来判断这个 websocket 连接是否正常
如果不正常就会触发定时连接，每 4s 钟重试一次，直到连接成功
如果是网络断开的情况下，在指定的时间内服务器端并没有返回心跳响应消息，因此服务器端断开了。
服务断开我们使用 ws.close 关闭连接，在一段时间后，可以通过 onclose 事件监听到

## websocket

1000 正常关闭
1001 终端离开
1002 协议错误
1003 数据类型错误
1011 服务器错误

## 建立通信过程-ws 三次握手

蕴含 http

1）首先客户端会发送一个握手包。这里就体现出了 WebSocket 与 Http 协议的联系，握手包的报文格式必须符合 HTTP 报文格式的规范。其中：

- 方法必须位 GET 方法
- HTTP 版本不能低于 1.1
- 必须包含 Upgrade 头部，值必须为 websocket
- 必须包含 Sec-WebSocket-Key 头部，值是一个 Base64 编码的 16 字节随机字符串。
- 必须包含 Sec-WebSocket-Version 头部，值必须为 13
  其他可选首部可以参考：https://tools.ietf.org/html/rfc6455#section-4.1

2）服务端验证客户端的握手包符合规范之后也会发送一个握手包给客户端。格式如下：

- 必须包含 Connection 头部，值必须为 Upgrade

- 必须包含一个 Upgrade 头部，值必须为 websocket

- 必须包含一个 Sec-Websocket-Accept 头部，值是根据如下规则计算的：

- 首先将一个固定的字符串 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 拼接到 Sec-WebSocket-Key 对应值的后面。
  对拼接后的字符串进行一次 SHA-1 计算
  将计算结果进行 Base-64 编码

3）客户端收到服务端的握手包之后，验证报文格式时候符合规范，以 2）中同样的方式计算 Sec-WebSocket-Accept 并与服务端握手包里的值进行比对。
