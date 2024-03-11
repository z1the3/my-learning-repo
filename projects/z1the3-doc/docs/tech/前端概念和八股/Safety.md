# 安全

## CSRF

### 防御手段

同源检测 根据请求头 origin 或 referer, referer 可伪造,而且会屏蔽搜索引擎

随机 token 在 url 请求参数中携带随机 TOKEN,繁琐,而且由于服务器负载均衡,可能服务器 session 没有存 token 的钥匙不能比较

cookie 双重验证,url 中参数也加上 cookie,因为攻击者只能利用 cookie 不能使用 cookie.有 XSS 漏洞会失效,且不能子域名隔离

cookie 设置 samesite,限制第三方使用

### CSRF Token

CSRF Token 通常也会通过 Cookie 的方式保存在客户端（浏览器）中，以便在每个请求中携带 Token。但是与普通的 Cookie 不同的是，CSRF Token 通常会采用 HttpOnly、Secure、SameSite 等安全措施来增强 Token 的安全性。
其中，HttpOnly 属性可以使得 Token 只能在服务端被访问，而无法在客户端被获取。Secure 属性可以保证 Token 只能通过 HTTPS 协议传输，避免 Token 被窃取。SameSite 属性可以限制 Cookie 只能在同源请求中携带，从而避免跨站点攻击。（重点在于 SameSite
因此，虽然 CSRF Token 最终也会存储在客户端的 Cookie 中，但是通过使用一些安全措施，可以使得 Token 更加安全，从而有效地防止 CSRF 攻击。

SameSite 是 Cookie 的一个属性，用于指定 Cookie 是否可以在跨站点请求中被发送。它有三个可选值：
● SameSite=None：表示 Cookie 可以在任何请求中发送，包括跨站点请求。但要注意，使用该选项必须同时设置 Secure 属性，以保证 Cookie 只会在安全的 HTTPS 连接中传输。
● SameSite=Strict：表示 Cookie 只能在同站点请求中发送，不能在跨站点请求中发送。
● SameSite=Lax：表示 Cookie 可以在一些跨站点请求中发送，例如从其他网站链接进入当前网站的 GET 请求，但对于 POST、PUT、DELETE 等修改请求，以及从其他站点的链接打开的窗口中的请求，仍然会被禁止发送。
其中，SameSite=Strict 是最安全的选项，可以有效地防止跨站点攻击（如 CSRF 攻击）。而 SameSite=None 需要额外的安全措施，否则可能会被滥用。 SameSite=Lax 则提供了一种折中的方案，可以在一定程度上平衡安全性和用户体验。

## XSS 攻击

### 防御手段

- 输入过滤和验证：在接收用户输入时，进行输入过滤和验证，去除或转义用户输入中的特殊字符和 HTML 标签，从而防止攻击者注入恶意代码。
- 输出转义：在将数据输出到页面时，对特殊字符和 HTML 标签进行转义，从而防止攻击者通过注入恶意代码来窃取用户信息或攻击网站。
- CSP（内容安全策略）：在网站中添加 CSP 策略，限制网页中可以加载的内容和脚本，防止攻击者通过注入恶意脚本来攻击网站。
- HTTP Only Cookie：将 Cookie 标记为 HTTP Only，防止 JavaScript 脚本通过 document.cookie 获取到会话令牌，从而防止会话劫持攻击。
- 输入长度限制：限制用户输入的长度，防止攻击者利用长

#### 输入过滤与验证

v-filter

```js
Vue.directive("filter", {
  bind: function (el, binding, vnode) {
    el.addEventListener("input", function () {
      let value = el.value;
      value = value.replace(/<[^>]*>|[\r\n\t]/gi, "");
      value = value.replace(/[&<>"]/gi, function (match) {
        switch (match) {
          case "&":
            return "&amp;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case '"':
            return "&quot;";
        }
      });
      vnode.context[binding.expression] = value;
    });
  },
});
```

#### 输出转义

在 Vue.js 中可以使用 v-html 指令来将数据渲染为 HTML 代码，并自动转义其中的特殊字符和 HTML 标签。例如，可以使用以下代码来渲染一个带有特殊字符和 HTML 标签的字符串：

```js
<template>
  <div v-html="htmlString"></div>
</template>
```

#### CSP

在 Vue.js 中可以使用 vue-meta 库来添加 CSP 策略，限制网页中可以加载的内容和脚本。例如，可以使用以下代码来添加 CSP 策略

```js
import Vue from "vue";
import VueMeta from "vue-meta";
Vue.use(VueMeta, {
  keyName: "metaInfo",
  attribute: "data-vue-meta",
  ssrAttribute: "data-vue-meta-server-rendered",
  tagIDKeyName: "vmid",
  refreshOnceOnNavigation: true,
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
  },
});
```

在 contentSecurityPolicy 选项中，可以设置不同的源策略（如 defaultSrc、scriptSrc、styleSrc 等）来限制不同类型的资源的加载。例如，上述代码设置了只允许加载本地资源和内联
的 JavaScript 脚本，同时禁止加载其他域名的脚本和资源。

#### Sanitize HTML

在 Vue.js 中可以使用 DOMPurify 库来过滤和清理用户输入的 HTML 代码，从而减少 XSS 攻击的风险。DOMPurify 库可以检测和清理 HTML 代码中的恶意代码，包括 JavaScript 脚本、HTML 注入、CSS 注入、URL 跳转等攻击方式。例如，在 Vue.js 中可以使用以下代码来过滤用户输入的 HTML 代码：

#### HTTP-only

可以通过在服务器端设置 HTTP-only 标记来防止 XSS 攻击。当 HTTP-only 标记被设置时，浏览器只会在 HTTP 请求中发送 cookie 信息，而禁止使用 JavaScript 等脚本来读取或修改 cookie。例如，在使用 Express.js 作为服务器端框架时，可以使用以下代码来设置 HTTP-only 标记：

```js
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
app.get("/", function (req, res) {
  res.cookie("sessionId", "12345", { httpOnly: true });
  res.send("Hello World!");
});
```

在上述代码中，使用 cookie-parser 中间件来解析 HTTP 请求中的 cookie 信息，并通过 res.cookie 方法来设置 HTTP-only 标记。这样，即使攻击者注入恶意 JavaScript 代码，也无法读取或修改 cookie 信息，从而保护用户的隐私和安全。
