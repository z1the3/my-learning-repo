# bfc 块级格式上下文

## 特性

● 内不影响外

● 解决同 BFC 内两元素相邻外边距折叠取绝对值大（相邻指无 borderPadding 可父子可兄弟可自身）可给其中一个开 BFC

● 塌陷父开 BFC 计算浮动高度

● 两栏自适应一方 BFC 不被遮挡

## 开启方式

● body 标签

● overflow 非 visible

● position 绝和固

● displayFLEX

### 清除浮动

塌陷父开 BFC| 加个 div 开 clear| 伪 after 开 clear content 高度 0
