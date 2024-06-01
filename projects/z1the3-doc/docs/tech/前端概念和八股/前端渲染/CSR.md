# CSR

CSR for Client Side Rendering
顾名思义的“客户端渲染”，是当下用于渲染各类 UI 库构建的前端项目的最常见方案。

啥是 CSR？
在这种模式下，页面托管服务器只需要对页面的访问请求响应一个类似这样的空页面：

```html
<!DOCTYPE html<html<head<meta charset="utf-8" />
<html>
  <!-- metas -->
  <head>
    <title></title>
    <link rel="shortcut icon" href="xxx.png" />
    <link rel="stylesheet" href="xxx.css" />
  </head>
  <body>
    <!-- page content -->
    <div id="root"></div>
    <script src="xxx/filterXss.min.js"></script>
    <script src="xxx/x.chunk.js"></script>
    <script src="xxx/main.chunk.js"></script>
  </body>
</html>
```

可以看到页面中留出一个用于填充渲染内容的视图节点 (div#root)，并插入指向项目编译压缩后的 JS Bundle 文件的 script 节点和指向 CSS 文件的 link.stylesheet 节点等。
浏览器接收到这样的文档响应之后，会根据文档内的链接加载脚本与样式资源，并完成以下几方面主要工作：执行脚本、进行网络访问以获取在线数据、使用 DOM API 更新页面结构、绑定交互事件、注入样式，以此完成整个渲染过程。

## CSR 模式有以下几方面优点

- UI 库支持：常用 UI 方案如 React、Vue（这里理解为 UI 框架），默认的应用形态都是 SPA (for Single Page Application)，是交互程度高、动态化强的 Web 应用，CSR 很好地满足了这种应用形态的需要，并在主流技术栈中拥有广泛支持；
- 前后端分离：视图交互和具体数据解耦，有赖于这种应用形态的出现和普及，做到前后端职能清晰明确，更容易维护与协作；
- 服务器负担轻：从示例可见，CSR 场景下的页面托管服务只需要对访问请求返回一个每次部署后固定的空白页，其他的资源加载和渲染交给浏览器完成，项目静态资源（bundle、css、assets）则都是部署在 CDN 上的，服务器负担轻、响应快，且更利于资源的终端和 CDN 缓存

## 这样的模式也具有以下缺陷

- 呈现速度受限：基于上面特点，尽管更轻的服务负荷带来了更快的访问响应速度，但 CSR 页面的呈现速度和效果容易受到限制——用户浏览器拿到模板 HTML 之后对文档和 JS 代码的解析耗时、逻辑执行耗时、接口请求耗时、加载静态资源工作对 CDN 情况、网络环境、终端浏览器性能的依赖，都能很大程度上影响甚至阻塞页面渲染，破坏用户体验；

- 不利于 SEO (for Search Engine Optimization)：爬虫请求 CSR 的页面时会受限从服务器得到不含内容的空页面，不利于站点在搜索引擎上的信息采集和曝光（但现在头牌搜索引擎如谷歌、百度、必应等，其爬虫能力已经可以部分支持 CSR SPA 的页面内容爬取）。在非常动态的、交互性很强而轻实际内容的情景下，SEO 友好程度或许并不重要——即使重要，也有部分解决方法，如结合 meta / template 插入一些重要信息，还有后面将会提到的 SSG；

- \*较低的安全性：了解到的一个论调是 CSR 场景下，页面更容易受到 XSS (for Cross-Site Scripting) 攻击，通过发掘页面内可以干预逻辑代码的入口，劫持用户的会话并进行恶意操作。CSR 在此方面相对安全性较低的一个考虑点，或许是有更多的逻辑代码需要在浏览器上直接运行并可见，让不怀好意者更有可乘之机——但在如今越来越多的安全工具、浏览器安全部署、代码混淆方案背景下，魔与道孰高孰低其实一直在较量之中。
