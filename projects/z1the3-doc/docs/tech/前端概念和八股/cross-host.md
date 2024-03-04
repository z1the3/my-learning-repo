# 跨域

## JSONP 的原理

JSONP 的实现原理是通过动态创建一个`<script>`标签，将请求的数据作为参数拼接在 URL 中，并指定回调函数的名称，然后通过这个`<script>`标签来向服务器请求数据，服务器收到请求后将数据以参数的形式传递给回调函数，最后将数据作为参数传递回来，由于这个回调函数是在同域下执行的，因此就解决了跨域问题。注意 JSONP 只能用于 GET 请求

要想实现一个 JSONP，可以按照以下的步骤 1.在 HTML 中创建一个回调函数，例如 handleData，并在全局范围定义它。这个函数将在数据请求成功后执行并处理返回后的数据

```js
<script>   function handleData(data) {     // 处理返回的数据   } </script>
```

2.动态创建一个<script>标签，并将数据源的 URL 作为其 src 的属性值，并将回调函数名称以参数的形式传递给服务器，例如`http://example.com/data?callback=handleData`。

```html
<script>
  var script = document.createElement("script");
  var url = "http://example.com/data?callback=handleData"; // 数据源的 URL   script.src = url;   document.head.appendChild(script);
</script>
```

3.服务器接收到请求之后，将数据作为参数传递给回调函数并将其包装在函数调用中返回。如果使用 Nodejs，可以使用 querystring 模块解析请求参数并返回符合 JSONP 规范的响应

```js
const http = require("http");
const querystring = require("querystring");
const server = http.createServer((req, res) => {
  const params = querystring.parse(req.url.split("?")[1]);
  const data = { name: "John", age: 30 };
  const callback = params.callback;
  res.writeHead(200, { "Content-Type": "text/javascript" });
  res.end(`${callback}(${JSON.stringify(data)})`);
  //返回的是一个脚本a(所需参数)！
});
server.listen(80);
```

4.当数据源返回响应时候，浏览器会将响应解释为 js 代码，("Content-Type": "text/javascript")

并在页面中执行回调函数。在 handleData 函数中，可以通过参数访问返回的数据并且进行处理
