# less

## 嵌套

```css
//less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
  & .test {
    width: 300px;
  }
}

//编译成 css 后，是后代选择器
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
// 注意这里不会嵌套和&同时出现不会造成重复
#header .test {
  width: 300px;
}
```

### &关键字:对父选择器的引用

注：它重复**所有的祖先选择器**，而不是仅仅重复最近的父选择器。
祖先选择器为.demo

- && 表示.demo.demo
- & & 表示.demo .demo
- &, & 表示.demo, .demo

使用场景主要是：`&__btn`, 满足 bem 规范，而不需要重写父选择器

## 定义变量

@表示变量

也可以在:root 定义变量

然后其他地方直接用`var(--name)`

这里能把变量限制在单个 less 文件范围内

```css
@color: #f93d66;

.xkd {
  border: 1px solid @color;
  h3 {
    background-color: @color;
  }
  .circle {
    color: @color;
  }
}
```
