# SSO 单点登录

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1709703547880.jpg" width="1500"/>

## CAS 中央认证服务

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1709705128292.jpg" width="1500"/>

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1709705383659.jpg" width="1500"/>

各类 SSO 服务往往都不会进行用户登录状态的维护，而是只负责用户登录状态的扩散（任何接入服务的应用网站都可以来我这里请求用户信息），登录状态的维护需要接入方自行处理（cookie-session 存储/token）。接入方自己给 token 设置过期，SSO 只无情返回 token

## Oauth

https://oauth.net/2/ 官网
OAuth 是一个为 Web、移动端应用、桌面应用设计的开放的授权标准，旨在让第三方应用能够在无需获取用户密码的前提下得到私有数据，它是一种授权规范。
Oauth2 有四种模式，其中 code 模式是使用范围最广的，下面我们就详细介绍一下：

## token 增加刷新机制

授权场景通常和登录场景有相似的流程，所以我们也可以使用 OAuth 规范来处理登录逻辑。

对一个应用来说，只要获取了用户的个人信息，就可以理解为这个用户登录了，SSO 服务授权给应用用户的个人信息就可以理解为典型的登录场景。

● CAS 专注于用户登录，Oauth 专注于授权，但也能干登陆的活
● CAS 用 ST(ticket)获取用户信息，只能使用一次。
● OAuth 更加复杂，多了一步通过 code 换取 access_token，code 只能使用一次，但 access_token 可以多次获得用户信息；CAS 直接通过 cookie 获取 ST
● OAuth 协议约定了 refresh_token/刷新访问令牌 机制，因此可以通过 refresh_token 在后端更新 token，无需再走一遍完整流程，CAS 协议则没有提供这种方案，如果 CAS 的登录状态过期了就必须重新登录
● OAuth 协议的请求会携带 state 参数，防范了 csrf 攻击的可能，更加安全

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1709707655358.jpg" width="500"/>

## cookie-session

● 接入方服务端自己维护一个 session 把从 sso 拿到的用户信息存入
● 生成一个不可被推测出的复杂字符串 session_id 作为 key
● 把 session_id 存入接入方域名的 cookie
● 当请求携带的 cookie 中有 session_id 时，我们就能查询出用户信息
● 如果没有 cookie，那就是用户没有登录，可以引导用户走 sso 流程
就这是经典的 cookie-session 模型。

## JWT（Json Web Token）

● 接入方使用从 sso 拿到的用户信息，生成用密钥加密的字符串 token
● 请求时在（请求头/POST 请求的数据体/url 的 query）里上带上 token，用来验证用户信息
● 接入方服务端需要根据 token 上的签名和密钥验证 token 的真实性
● 如果请求的 token 信息过期，需要刷新 token
就这是 JWT 模型。
指路大佬文章——>如果你想深入理解 token

https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html

cookie session token 都是状态管理方案

token 是由服务器签发的包含用户信息的字符串，好处是存储在客户端

jwt 按照一定规则签发的 token,没有密钥无法以相同方式生成签名，所以防止伪造

access token 短周期销毁，用于常用的接口，容易被盗取

refresh token 长周期销毁，用于获取新的 access token，通过独立服务和严格请求方式增强其安全性

cookie 主要用于 session 验证，数据存在服务器 session 里
token 可以通过 cookie 发送，但是 cookie 在域中自动携带，CSRF，所以不存在请求头 cookie 中更好

## 区别

● 因为 JWT 并不依赖 Cookie 的，所以你可以使用任何域名提供你的 API 服务而不需要担心跨域资源共享问题（CORS），而 cookie-session 模式则不行。

● JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数，使用 session 则需要频繁查库，造成服务不稳定。

● JWT 最大的优势是服务器不再需要存储 session，使得服务器认证鉴权业务可以方便扩展。但这也是 JWT 最大的缺点：由于服务器不需要存储 session 状态，因此使用过程中无法废弃某个 Token 或者更改 Token 的权限。也就是说一旦 JWT 签发了，到期之前就会始终有效，而 session 服务可以轻松的删除某个用户的登录态，不需要依赖于其他能力。
● JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。session 相比于 token 往往拥有更长的有效时间。

拓展
前端需要了解的 SSO 与 CAS 知识 - 掘金
https://juejin.cn/post/6844903509272297480#heading-8

OAuth 2.0 协议详解
