# Vue scoped

当 `<style>` 标签有 scoped 属性时，它的 CSS 只作用于当前组件中的元素

原理： PostCSS, 属性选择器
通过使用 PostCSS 来实现以下转换：

```css
.example {
  color: red;
}
```

```css
.example[data-v-f3f3eg9] {
  color: red;
}
```

不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式，父组件利用深度作用选择器影响子组件样式

```css
.a.b {
  /* ... */
}

.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

有些像 Sass 之类的预处理器无法正确解析 。这种情况下你可以使用 /deep/ 或 ::v-deep 操作符取而代之——两者都是深度选择器的别名，同样可以正常工作
