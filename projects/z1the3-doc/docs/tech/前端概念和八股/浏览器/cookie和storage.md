# 浏览器 storage

localStorage 理论上来说是永久有效的，即不主动清空的话就不会消失，即使保存的数据超出了浏览器所规定的大小，也不会把旧数据清空而只会报错。但需要注意的是，在移动设备上的浏览器或各 Native App 用到的 WebView 里，

localStorage 都是不可靠的，可能会因为各种原因（比如说退出 App、网络切换、内存不足等原因）被清空。

sessionStorage 的生存期顾名思义，类似于 session，只要关闭浏览器（也包括浏览器的标签页），就会被清空。由于 sessionStorage 的生存期太短，因此应用场景很有限，但从另一方面来看，不容易出现异常情况，比较可靠。

## session storage 怎样在多个标签页间共享

以下的讨论是以同源为前提。（同源和同站是有区别的，同源要求更为严格）
不是所有的 sessionStorage 都能共享。

1. 第一种情况

浏览器中打开 A 页面，再通过 A 页面打开新的标签页 B 页面,此时 A、B 两个页面的 sessionStorage 是“共享”的。这里的共享指的是 B 页面会把 A 页面的的 sessionStorage 拷贝一份，作为 B 页面 的初始缓存值，此时改变 B 页面的 session,A 页面并不受影响。即不同 Tab 之间，session 读写操作独立，互不影响。

// 之前通过两种方式打开新标签页都可以共享 session

```html
window.open(‘xxx’)
<a href="xxx" target="_blank"> </a>
//但是现在浏览器把sessionStorage设置为正经的单页面使用，需要在a标签中添加
rel=“opener”，才能实现共享，或者直接用js打开页面window.open()
<a href="xxx" target="_blank" rel="opener"> </a>
```

2. 第二种情况
   浏览器中打开 A 页面，然后手动新开一个标签页，在新的标签页中打开 B 页面，此时 A、B 两个页面的 sessionStorage 是不“共享”，即 B 页面不会继承 A 页面 session 作为初始值。
   新开一个标签页总是会初始化一个 session，即使是同一个网站。

localStorage
同源状态下，不同标签页之间均可读写，相互影响

## onStorage 事件可以用来清除过期 localStorage

## cookie 和 storage 的区别

Cookie 和 Web Storage（包括 localStorage 和 sessionStorage）都是用来在浏览器端存储数据的机制，但是它们有以下几个区别：

1. 存储容量不同：Cookie 的存储容量一般为 4KB，而 Web Storage 的存储容量一般为 5MB 或更大（具体取决于浏览器实现）。
2. 与服务器交互方式不同：Cookie 在每次 HTTP 请求中都会携带，因此会增加网络流量，而 Web Storage 不会在每次 HTTP 请求中携带，仅在需要的时候手动读取。
3. 过期时间不同：Cookie 可以设置过期时间，一旦过期就会被浏览器删除，而 Web Storage 默认永久存储，除非手动删除或清空。
4. 与域名相关性不同：Cookie 和 Web Storage 都与域名相关，但是 Cookie 还可以设置为与子域名相关，而 Web Storage 不支持跨子域名访问。
5. API 不同：Cookie 的 API 比较简单，只有 document.cookie 属性可以设置和获取 Cookie，而 Web Storage 有专门的 localStorage 和 sessionStorage 对象，提供了更多的操作方法和事件监听。

另外：Cookie 只能存储字符串类型的数据，而 Web Storage 也是只能存储字符串，存储对象需要 JSON.stringify

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
