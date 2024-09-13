# head 和 body

```html
<html>
  html文档根标签
  <head>
    head,页面需要但不想展示给用户
    <meta xxx="xxx" />
    用meta标签存放一些元数据
    <title>xxx</title>
    用title标签表示页面标题（必须要有此标签）
  </head>

  <body>
    ........
  </body>
</html>
```

html 文档解析时会解析标签生成 DOM 树
但是 DOM 树的根节点是 document，其次才是`<html>`

## 为什么网页中经常把 css 文件添加在 head，而 js 文件添加在 body 尾部？

答案：因为 head 中的资源会在浏览器解析 body 之前加载并执行完毕。样式表需要在 body 解析前生效，否则用户有可能看到一闪而过的样式崩坏的页面。

js 逻辑一般在类似 `DOMContentLoaded` 的事件回调中执行（图片等资源加载好），所以在很多情况下，并不需要把 js 文件放置在 head 头部。因为在浏览器加载 head 中引用的资源时，页面会处于完全空白的状态。

放在 body 尾部的原因是，浏览器在解析 body 期间，遇到 js 文件会先等待 js 文件加载执行完毕，然后再解析剩余部分。放置在 body 尾部，可以让页面（body）更快呈现出来，带来更好的用户体验。

## script 标签上的 defer 和 async 有什么用？

    浏览器下载脚本资源时不阻塞 dom 的后续渲染，执行才会阻塞。defer 会在 body 全部渲染完毕后执行，async 会在资源下载完成时，停止 dom 渲染并立即执行脚本内容，然后继续渲染 dom（阻塞渲染）
