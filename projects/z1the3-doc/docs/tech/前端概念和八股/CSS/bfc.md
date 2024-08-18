# bfc 块级格式上下文

## 经典问题 1

一个 div 内，两个相邻 div；
上方 div 有 margin-bottom 30px
下方 div 有 margin-top 30px

两个 div 间距为？

30px,因为相邻 div 外边距（margin）折叠

## 经典问题 2

一个 div 内，一个子 div 紧贴上部
子 div margin 设为 30px

会怎样？

父 div 出现上边距 30px (0 和 30 折叠)

## 特性

● 内不影响外（内部元素外边距也不会影响外）

● 解决同 BFC 内两元素相邻外边距折叠取绝对值大（相邻指无 border，父元素无 Padding 可以是父子兄弟自身）可给其中一个开 BFC

● 父元素开 BFC 会计算内部浮动元素高度（防止塌陷）

● 两栏布局，自适应的那一方 BFC 不被遮挡

## 开启方式

● body 标签是一个 bfc

● overflow 非 visible

● position absolute 和 fixed

● displayFLEX

### 清除浮动的几种办法

- 塌陷父开 BFC
- 加个 div 开 clear（引入其他元素，不推荐）
- 伪元素 after 开 clear content 为空， 高度为 0
