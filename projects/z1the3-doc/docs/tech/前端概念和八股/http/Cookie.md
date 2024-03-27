# Cookie

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
  子路径，限制文件目录，的默认为当前
  如果子路径是/b/a
  则在 b.a.com/a 不能访问
  但是在 b.a.com/b/a 可以访问

- Expires/Max-age
  可以用 Expires 时间戳
  也可以用 Max-age 有效期，若设置为 0，则立刻失效
  设置为 -1 则在页面关闭时失效，默认为 -1

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
