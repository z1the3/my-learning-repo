# TCP 和 UDP

## TCP 和 UDP

### TCP

TCP: 收发数据前必须和对方建立可靠的连接，建立连接的 3 次握手、断开连接的 4 次挥手，为数据传输打下可靠基础。

面向连接，是可靠服务，传输比较慢，报文格式面向字节流，常见场景网页、邮件。

### UDP

UDP: 是一个面向无连接的协议，数据传输前，源端和终端不建立连接，发送端尽可能快的将数据扔到网络上，接收端从消息队列中读取消息段。

面向无连接，可靠性不保证，传输快，格式面向报文，常见场景语音广播。（适用于人脑可补齐丢包的场景）
