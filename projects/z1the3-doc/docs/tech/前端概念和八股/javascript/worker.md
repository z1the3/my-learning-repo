# worker

## 1. web 有哪些常见的 worker？

A: web worker、service worker、shared worker

## 2. worker 的优势和作用？

A: 一个独立于 JavaScript 主线程的独立线程，在里面执行需要消耗大量资源的操作不会堵塞主线程

## 3. worker 和页面怎么通信？

A: 通过 onmessage/postMessage 方法

## 4. shared worker 是什么？

A: web worker 默认只能被生成它的父级页面所调用，但是 shared worker 可以被多个页面共享使用。

## 5. Service worker 是什么？有什么用？

A: 基于 web worker，在基础上增加了离线缓存能力，可以充当一个网站和浏览器之间的代理服务器，可以拦截全部的请求并做出相应的动作；创建有效的离线体验；具有声明周期；可以访问 cache 和 indexDB；支持推送。

可以实现 mock 服务器
