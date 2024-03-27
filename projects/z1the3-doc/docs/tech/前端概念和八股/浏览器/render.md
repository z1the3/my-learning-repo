# 渲染

CSS 加载不会阻塞对 Dom 树的解析（Dom 的解析和 CSS 解析是并行的）
CSS 加载会阻塞对 Dom 树的渲染
CSS 加载会阻塞其后的 JS 执行

解决方法：提到复合层，从而利用多线程

JS 会阻塞 Dom 的构建

浏览器解析和渲染 html 流程 说了 tokenization，构建 dom 树，css rules，render 树，再计算 layout，最后渲染图形
