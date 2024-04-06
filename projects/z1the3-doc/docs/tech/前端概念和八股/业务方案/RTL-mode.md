# RTL-mode

实现方案

- 整体排版
  - 使用 css direction, 在根节点设置 direction: rtl；可以让大部分样式都符合 RTL mode 的排版
- 细节排版
  - 避免使用指定 left 和 right 的 css 属性
  - 如 margin-inline-start 替换 margin-left, padding-inline-start 替换 padding-left
  - border-start-end-radius, border-inline-end
  - 利用工具函数在 rtl 模式下自动切换样式，最好使用 css in js
- 特殊处理
  - icon 镜像，css 利用 transofrom rotateY
