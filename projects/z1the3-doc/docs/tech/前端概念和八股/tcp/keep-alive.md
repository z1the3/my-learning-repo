## TCP 的 Keep-Alive

HTTP 的 Keep-Alive 需要和 TCP 的 Keep-Alive 区分开
TCP 自身也有 Keep-Alive，是检测 TCP 连接状况的保鲜机制

- net.ipv4.tcpkeepalivetime：表示 TCP 链接在多少秒之后没有数据报文传输启动探测报文
- net.ipv4.tcpkeepaliveintvl：前一个探测报文和后一个探测报文之间的时间间隔
- net.ipv4.tcpkeepaliveprobes：探测的次数
  逻辑为：tcpkeepalivetime 时间没有数据则开始探测，每过 tcpkeepaliveintvl 探测一次，最多探测 tcpkeepaliveprobes 次，如果全部失败则关闭 TCP 连接。
