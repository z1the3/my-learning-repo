# http

## GET

get 在 url 里，post 在 request body 里
get 有长度限制（主要由于 url 长度限制）
get 会暴露敏感
get 请求的参数 query params 查询参数
xxx/?a=1&b=2

## OPTIONS 预检

是指在跨域请求时候，浏览器会首先发送一个预检请求，以确定实际请求可否被服务器所接受。是 CORS 规范中一部分。可以提高程序的安全性
在跨域请求中，如果请求的方法不是简单请求（例如，使用 PUT 或 DELETE 方法），或者请求头包含了一些自定义头部，那么浏览器会发送一个 OPTIONS 请求（预检请求）到服务器端，以获取一些必要的信息，包括：

- 请求的方法是否被服务器所允许；
- 请求头中是否包含了某些不支持的内容类型；
- 是否需要在请求中使用凭据（例如，cookies、HTTP 认证等）。
  服务器收到预检请求后，会根据请求中的 Origin 字段来确定是否接受请求，如果接受，则在响应头中设置一些额外的信息，包括：
- Access-Control-Allow-Origin：指定可以接受请求的源地址；
- Access-Control-Allow-Methods：指定可以接受的请求方法；
- Access-Control-Allow-Headers：指定可以接受的请求头；
- Access-Control-Allow-Credentials：指定是否可以在请求中使用凭据（主要是 cookie
  浏览器收到预检请求的响应后，如果服务器允许该跨域请求，则会发送实际的请求。如果服务器拒绝该跨域请求，浏览器会在控制台中显示相应的错误信息。需要注意的是，预检请求会增加额外的网络开销，因此应该尽量避免在跨域请求中使用不必要的自定义请求头或不常用的请求方法，以减少预检请求的发送次数

## 转义 encodeURIComponent

encodeURI 负责转义整个 URI，但对#&/等不一定在参数中出现的不会转义
恢复用 decodeXXXXX

为了避免服务器收到不可预知的请求，对任何用户输入的作为 URI 部分的内容你都需要用 encodeURIComponent 进行转义。比如，一个用户可能会输入"Thyme &time=again"作为 comment 变量的一部分。如果不使用 encodeURIComponent 对此内容进行转义，服务器得到的将是 comment=Thyme%20&time=again。请注意，"&"符号和"="符号产生了一个新的键值对，所以服务器得到两个键值对（一个键值对是 comment=Thyme，另一个则是 time=again），而不是一个键值对。
对于 application/x-www-form-urlencoded (POST) 这种数据方式，空格需要被替换成 '+'，所以通常使用 encodeURIComponent 的时候还会把 "%20" 替换为 "+"。

## https

一般情况下，不管 TLS 握手次数如何，都得先经过 TCP 三次握手后才能进行，因为 HTTPS 都是基于 TCP 传输协议实现的，得先建立完可靠的 TCP 连接才能做 TLS 握手的事情。

tls1.2 需要四次握手(客户-服务,服务-客户,客户-服务,服务-客户), 2RTT
tls1.3 需要两次(客户-服务,服务-客户),1RTT
tls1.3 还有个更厉害到地方在于会话恢复机制，在重连 TLvS1.3 只需要 0-RTT

**「HTTPS 中的 TLS 握手过程可以同时进行三次握手」，这个场景是可能存在到，但是在没有说任何前提条件，而说这句话就等于耍流氓。需要下面这两个条件同时满足才可以：**
● 客户端和服务端都开启了 TCP Fast Open 功能，且 TLS 版本是 1.3；
● 客户端和服务端已经完成过一次通信；

如果使用的是 HTTPS 协议，在通信前还存在 TLS 的一个四次握手的过程。

首先由客户端向服务器端发送使用的协议的版本号、一个随机数和可以使用的加密方法。

服务器端收到后，确认加密的方法，也向客户端发送一个随机数和自己的数字证书。

客户端收到后，首先检查数字证书是否有效，如果有效，则再生成一个随机数，并使用证书中的公钥对随机数加密，然后发送给服务器端，并且还会提供一个前面所有内容的 hash 值供服务器端检验。

服务器端接收后，使用自己的私钥对数据解密，

同时向客户端发送一个前面所有内容的 hash 值供客户端检验。这个时候双方都有了三个随机数，按照之前所约定的加密方法，使用这三个随机数生成一把秘钥，以后双方通信前，就使用这个秘钥对数据进行加密后再传输

## 请求头

备注:
● 所有请求头都是 Aaa-Bbb 的形式

### 1. Accept

浏览器可以接受的服务器返回类型
值: text/html, /
/ 表示能接受所有类型

### 2. Accept-Encoding

浏览器可以接受的编码方式 (通常是压缩方法)
值: gzip, deflate

### 3. Accept-Language

浏览器接受的语言
值: zh-CN,zh;q=0.9
指出浏览器可以接受的语言种类，如 en 或 en-us 指英语，zh 或者 zh-cn 指中文， 当服务器能够提供一种以上的语言版本时要用到。

### 4. Cache-Control

值: private(默认), public, must-revalidate, no-cache, no-store, max-age=10(单位秒)

### 5. Connection

值: keep-alive, close
keep-alive: 网页打开后, TCP 连接也不会断开
close: 每次请求结束会断开连接, 下一次重新建立

### 6. Content-Type

值: Content-Type = Text/XML; charset=gb2312;
POST 请求使用

### 7. Cookie

值: lang=zh-cn;\_session=Cm4ikBOx-D8g==;a=b;c=d

### 8. Host (必须)

值: www.baidu.com
可包含主机和端口号

### 9. Referer

值: www.baidu.com/具体页面
告诉服务器自己从哪个页面链接过来的

### 10. Range

    Range:bytes=0-5000
    指定第一个字节和最后一个字节的位置, 主要用于断点续传

### 11. User-Agent

    值: Mozilla/........
    客户端使用的操作系统和浏览器名称

## 响应头

### 1.Cache-Control（对应请求中的 Cache-Control）

Cache-Control:private 默认为 private 响应只能够作为私有的缓存，不能再用户间共享

Cache-Control:public  浏览器和缓存服务器都可以缓存页面信息。

Cache-Control:must-revalidate 对于客户机的每次请求，代理服务器必须想服务器验证缓存是否过时。

Cache-Control:no-cache 浏览器和缓存服务器都不应该缓存页面信息。

Cache-Control:max-age=10  是通知浏览器 10 秒之内不要烦我，自己从缓冲区中刷新。

Cache-Control:no-store  请求和响应的信息都不应该被存储在对方的磁盘系统中。

### 2.Content-Type

Content-Type：text/html;charset=UTF-8

告诉客户端，资源文件的类型，还有字符编码，客户端通过 utf-8 对资源进行解码，然后对资源进行 html 解析。通常我们会看到有些网站是乱码的，往往就是服务器端没有返回正确的编码。

### 3.Content-Encoding

Content-Encoding:gzip

告诉客户端，服务端发送的资源是采用 gzip 编码的，客户端看到这个信息后，应该采用 gzip 对资源进行解码。

### 4.Date

Date: Tue, 03 Apr 2018 03:52:28 GMT

这个是服务端发送资源时的服务器时间，GMT 是格林尼治所在地的标准时间。http 协议中发送的时间都是 GMT 的，这主要是解决在互联网上，不同时区在相互请求资源的时候，时间混乱问题。

### 5.Server

Server：Tengine/1.4.6  
这个是服务器和相对应的版本，只是告诉客户端服务器信息。

### 6.Transfer-Encoding

Transfer-Encoding：chunked
这个响应头告诉客户端，服务器发送的资源的方式是分块发送的。一般分块发送的资源都是服务器动态生成的，在发送时还不知道发送资源的大小，所以采用分块发送，每一块都是独立的，独立的块都能标示自己的长度，最后一块是 0 长度的，当客户端读到这个 0 长度的块时，就可以确定资源已经传输完了。

### 7.Expires

Expires:Sun, 1 Jan 2000 01:00:00 GMT
这个响应头也是跟缓存有关的，告诉客户端在这个时间前，可以直接访问缓存副本，很显然这个值会存在问题，因为客户端和服务器的时间不一定会都是相同的，如果时间不同就会导致问题。所以这个响应头是没有 Cache-Control：max-age=\*这个响应头准确的，因为 max-age=date 中的 date 是个相对时间，不仅更好理解，也更准确。

### 8.Last-Modified

Last-Modified: Dec, 26 Dec 2015 17:30:00 GMT

所请求的对象的最后修改日期(按照 RFC 7231 中定义的“超文本传输协议日期”格式来表示)

### 9.Connection

Connection：keep-alive

这个字段作为回应客户端的 Connection：keep-alive，告诉客户端服务器的 tcp 连接也是一个长连接，客户端可以继续使用这个 tcp 连接发送 http 请求。

### 10.Etag

ETag: "737060cd8c284d8af7ad3082f209582d"  就是一个对象（比如 URL）的标志值，就一个对象而言，比如一个 html 文件，如果被修改了，其 Etag 也会别修改，所以，ETag 的作用跟 Last-Modified 的作用差不多，主要供 WEB 服务器判断一个对象是否改变了。比如前一次请求某个 html 文件时，获得了其 ETag，当这次又请求这个文件时，浏览器就会把先前获得 ETag 值发送给 WEB 服务器，然后 WEB 服务器会把这个 ETag 跟该文件的当前 ETag 进行对比，然后就知道这个文件有没有改变了。

### 11.Refresh

Refresh: 5; url=http://baidu.com   用于重定向，或者当一个新的资源被创建时。默认会在 5 秒后刷新重定向。

### 12.Access-Control-Allow-Origin

Access-Control-Allow-Origin: \*   *号代表所有网站可以跨域资源共享，如果当前字段为*那么 Access-Control-Allow-Credentials 就不能为 true

Access-Control-Allow-Origin: www.baidu.com 指定哪些网站可以跨域资源共享

### 13.Access-Control-Allow-Methods

Access-Control-Allow-Methods：GET,POST,PUT,DELETE   允许哪些方法来访问

### 14.Access-Control-Allow-Credentials

Access-Control-Allow-Credentials: true  是否允许发送 cookie。默认情况下，Cookie 不包括在 CORS 请求之中。设为 true，即表示服务器明确许可，Cookie 可以包含在请求中，一起发给服务器。这个值也只能设为 true，如果服务器不要浏览器发送 Cookie，删除该字段即可。如果 access-control-allow-origin 为\*，当前字段就不能为 true

### 15.Content-Range

Content-Range: bytes 0-5/7877
指定整个实体中的一部分的插入位置，他也指示了整个实体的长度。在服务器向客户返回一个部分响应，它必须描述响应覆盖的范围和整个实体长度。
