# 常见请求头/响应头

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
