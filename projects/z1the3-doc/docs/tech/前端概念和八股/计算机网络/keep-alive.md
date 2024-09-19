## TCP 的 Keep-Alive

HTTP 的 Keep-Alive 需要和 TCP 的 Keep-Alive 区分开
TCP 自身也有 Keep-Alive，是检测 TCP 连接状况的保鲜机制

- net.ipv4.tcpkeepalivetime：表示 TCP 链接在多少秒之后没有数据报文传输启动探测报文
- net.ipv4.tcpkeepaliveintvl：前一个探测报文和后一个探测报文之间的时间间隔
- net.ipv4.tcpkeepaliveprobes：探测的次数
  逻辑为：tcpkeepalivetime 时间没有数据则开始探测，每过 tcpkeepaliveintvl 探测一次，最多探测 tcpkeepaliveprobes 次，如果全部失败则关闭 TCP 连接。

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
