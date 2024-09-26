# Cookie

HTTP 状态管理机制（State Management Mechanism）定义了 HTTP 头字段 Cookie 和 Set-Cookie，以及如果通过这两个头字段去实现状态管理。

HTTP 状态管理机制虽然使用了 HTTP 头字段，但并不属于 HTTP 协议范畴。它关注的是，使用 HTTP 协议的通信实体之间如何实现状态管理，所以个人认为它是 HTTP 之上的解决方案。

HTTP 状态管理机制的主逻辑其实比较简单。服务器通过 HTTP 响应头字段 Set-Cookie 把状态信息传送给用户代理（User agent，比如浏览器），用户代理把状态信息存起来，下次发送请求的时候自动把合法的状态信息通过请求头字段 Cookie 传送给服务器。由于 Unix 系统中有个类似功能的东西叫做 Magic cookie，发明这套机制的人就把这些状态信息叫做 Cookie。除了使用 HTTP 头字段，用户代理也会提供 non-HTTP 接口（比如 HTML 的 document.cookie）和 Cookie 管理界面来读写 Cookie

```
// HTTP 头示例

// Server -> User Agent

Set-Cookie: STATE=31d4d96e407aad42

// User Agent -> Server

Cookie: STATE=31d4d96e407aad42
```

在 HTTP 头字段 Set-Cookie 中，除了可以设置 Cookie 的名称和值外，还可以设置 Cookie 属性，

比如 Expires、Max-Age、Domain、Path、Secure 和 HttpOnly。这些属性用来控制用户代理对 Cookie 的存储和访问行为。这些属性都会被用户代理保存起来。除此之外，用户代理还会保存 creation-time、last-access-time 等信息。

HTTP 头字段 Cookie 则不包含这些属性，只有键和值，因为这些属性对服务器没有意义，不需要传送给服务器。

## cookie 更新

一个小问题是，如何自动删除一个已有的 Cookie 呢？把 Cookie 的 Expires 设置成一个过去的时间，该 Cookie 就会被用户代理删除。

cookie 的删除其实特别简单，也是对此 cookie 重新赋值，将 expries 设为一个过去的时间或将 max-age 设为 0，都可以删除 cookie。同时也要特别注意此 cookie 的 domain、path 要与原来保持一致。

```
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
document.cookie = "username=; max-age=0";
```

用户代理对 Cookie 的存储有容量限制，规范在这方面的要求是：

- 每个 Cookie 最小 4 KB 大小（包括 Cookie 的名称、值和属性）
- 每个域最少 50 个 Cookie
- 总共最少 3000 个 Cookie
  规范并不是在主动限制 Cookie 的大小和数量，相反，是在保障用户代理对 Cookie 存储的最小量的支持。如果 Cookie 的数量超过了这个限制会出现什么情况呢？会无法存储新的 Cookie 吗？不会的。用户代理会按照一定的优先级删除一些 Cookie。可以简单理解为删除最近访问时间最老的那些 Cookie。

## 后端收到同名 cookie

后端拿前端有两个同名的 cookie,是什么情况？
因为父域和子域的 cookie 同时传了过来

## 服务端读取 cookie

服务器读取 cookie，需要安装 cookieParser 库，这样 req.cookies 能拿到

```js
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
app.get("/", function (req, res) {
  // set cookie的过程用中间件解决
  res.cookie("sessionId", "12345", { httpOnly: true });
  res.send("Hello World!");
});
```

在上述代码中，使用 cookie-parser 中间件来解析 HTTP 请求中的 cookie 信息，

### cookie 的属性

cookie 的内容就是保存的一小段文本信息，这些文本信息组成了一个通行证。 存在本地的 Cookies 实际上是一个 sqlite 数据库文件 key-value 的数据：

- Name
  名称

- Value
  如果为二进制值，只支持 base64 格式

- Domain
  决定在哪个域是生效的
  是对子域生效的
  设置为.a.com 则 b.a.com 和 c.a.com 都能使用该 cookie
  设置为 b.a.com 则 c.a.com 不可使用

- Path
  子路径，限制文件目录，默认为当前
  如果子路径是/b/a
  则在 b.a.com/a 不能访问
  但是在 b.a.com/b/a 可以访问

- Expires/Max-age
  可以用 Expires 时间戳
  也可以用 Max-age 有效期，若设置为 0，则立刻失效，表示删除该 cookie

  max-age 属性为正数，则表示该 cookie 会在 max-age 秒之后自动失效
  设置为 -1 则在页面关闭时失效，默认为 -1。max-age 为负数，则表示该 cookie 仅在本浏览器窗口以及本窗口打开的子窗口内有效，关闭窗口后该 cookie 即失效。

- Size
  若超过该限制，无法被设置上

- HttpOnly
  不允许脚本使用 document.cookie 修改 cookie，但请求时仍然可以携带

- Secure
  浏览器只会在 https 和 SSL 等安全协议中携带

- SameSite
  限制第三方 cookie,有三个值 Strict Lax None

  Strict 完全禁止发送第三方 cookie
  Lax 只有顶级导航和导航到第三方的 get 请求会发送
  None Secure 为 true 才能设置，同站和跨站都可以发送

- Priority
  优先级，当 cookie 数量过多时，优先级低的会被清除

https://blog.csdn.net/qq_39834073/article/details/107808959

## 域名共享

二级域名及其子域名间是可以共享cookie的，如a.young.com 和 b.young.com 之间是可以共享的。

服务端写入cookie到.young.com即可
