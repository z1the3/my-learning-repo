# 安全

## token

使用 token 的缺点有哪些？答案：以 jwt 为例，token 一旦签发是无法撤回的，在时效内如果 token 泄露了，服务端有可能收到恶意请求。如何处理 token 过期问题？答案：在约定的过期时间之前，向服务器交换一个新的 token；并且在网页应用中维护一个统一的逻辑，比如当有异步请求响应类似 401 之类的状态码时，网页自动重定向到登录页之类的

## cookie

服务端在设置客户端 cookie 时，添加 http-only 属性，能否避免 CSRF 攻击？回答：不能。http-only 只能防止浏览器脚本读取这个 cookie 值。CSRF 攻击并不需要获取 cookie 信息。采用 token 方案才能避免 CSRF。
