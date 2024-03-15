# CSRF

CSRF，跨站请求伪造（英文全称是 Cross-site request forgery），是一种挟制用户在当前已登录的 Web 应用程序上执行非本意的操作的攻击方法。

## 防御手段

同源检测

检查请求头 origin 或 referer, referer 可伪造,而且会屏蔽搜索引擎

随机 token 在 url 请求参数中携带随机 TOKEN,繁琐

cookie 双重验证,url 中参数也加上 cookie,因为攻击者只能利用 cookie 不能使用 cookie

有 XSS 漏洞会失效,且不能子域名隔离

cookie 设置 samesite,限制第三方使用

## CSRF Token

CSRF Token 通常也会通过 Cookie 的方式保存在客户端（浏览器）中，以便在每个请求中携带 Token。但是与普通的 Cookie 不同的是，CSRF Token 通常会采用 HttpOnly、Secure、SameSite 等安全措施来增强 Token 的安全性。

其中，HttpOnly 属性可以使得 Token 只能在服务端被访问，而无法在客户端被获取。Secure 属性可以保证 Token 只能通过 HTTPS 协议传输，避免 Token 被窃取。SameSite 属性可以限制 Cookie 只能在同源请求中携带，从而避免跨站点攻击。（重点在于 SameSite

因此，虽然 CSRF Token 最终也会存储在客户端的 Cookie 中，但是通过使用一些安全措施，可以使得 Token 更加安全，从而有效地防止 CSRF 攻击。

SameSite 是 Cookie 的一个属性，用于指定 Cookie 是否可以在跨站点请求中被发送。它有三个可选值：

- SameSite=None：表示 Cookie 可以在任何请求中发送，包括跨站点请求。但要注意，使用该选项必须同时设置 Secure 属性，以保证 Cookie 只会在安全的 HTTPS 连接中传输。

- SameSite=Strict：表示 Cookie 只能在同站点请求中发送，不能在跨站点请求中发送

- SameSite=Lax：表示 Cookie 可以在一些跨站点请求中发送，例如从其他网站链接进入当前网站的 GET 请求，但对于 POST、PUT、DELETE 等修改请求，以及从其他站点的链接打开的窗口中的请求，仍然会被禁止发送。
  其中，SameSite=Strict 是最安全的选项，可以有效地防止跨站点攻击（如 CSRF 攻击）。而 SameSite=None 需要额外的安全措施，否则可能会被滥用。 SameSite=Lax 则提供了一种折中的方案，可以在一定程度上平衡安全性和用户体验。
