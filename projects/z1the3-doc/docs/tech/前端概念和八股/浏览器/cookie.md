# cookie

## 应用于

- 会话管理：登录名，购物车商品，游戏得分等等
- 个性化：用户首选项，主题或设置
- 跟踪：记录和分析用户行为，比如埋点

## 后端拿前端有两个同名的 cookie,是什么情况？

因为父域和子域的 cookie 同时传了过来

## 跨域共享 cookie

如果需要域名之间跨域共享 Cookie，有两种方法：

1. 使用 Nginx 反向代理
2. 在一个站点登陆之后，往其他网站写 Cookie。服务端的 Session 存储到一个节点，Cookie 存储 sessionId

## CORS 中 Cookie 相关问题

在 CORS 请求中，如果想要传递 Cookie，就要满足以下三个条件：
● 在请求中设置 withCredentials 为 true

默认情况下在跨域请求，浏览器是不带 cookie 的。但是我们可以通过设置 withCredentials 来进行传递 cookie.

```js
// 原生 xml 的设置方式
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
// axios 设置方式
axios.defaults.withCredentials = true;
```

● Access-Control-Allow-Credentials 设置为 true
● Access-Control-Allow-Origin 设置为非 \*

如果是跨域
简单地把 Access-Control-Allow-Origin 设为\*是不行的
CORS 请求你默认不发送 Cookie 和 HTTP 认证信息

需要进行以下三步

1. 发送 ajax 请求时把 withCredentials 配置为 true
2. 服务端要设置 Access-Control-Allow-Credentials 为 true
3. 服务端的 Access-Control-Allow-Origin 不能设为星号，只能设为请求的来源域!（具体）
