# css 进阶

## 函数

### attr()

```html
<div data-color="red"></div>
```

```css
div {
  background-color: attr(data-color);
}
```

### counter()和 counters()

https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Counter_Styles/Using_CSS_counters

● counter-name：计数器的名称。
● separator：一个字符串，用于分隔不同计数器的值。
● style：一个可选参数，指定计数器的显示样式，如 decimal（十进制）、upper-roman（大写罗马数字）等。如果省略，将使用默认的十进制样式。

counters 可以生成多个计数器的内外嵌套

```css
/* 重置计数器 */
ol {
  counter-reset: mycounter;
}

/* 递增计数器 */
li::before {
  counter-increment: mycounter;
  content: counters(mycounter, " "); /* 使用空格作为分隔符 */
}
```

在这个例子中，每当遇到一个`<li>元素`时，item 计数器就会递增。counters(item, " ")函数会将所有嵌套级别的计数器值连接起来，并使用空格分隔它们。因此，对于一个三级嵌套的列表项，它的内容将类似于“1 2 3”。

注意，为了使计数器工作，还需要使用 counter-reset 和 counter-increment 属性来初始化和递增计数器。同时，counter()和 counters()函数通常与::before 或::after 伪元素一起使用，以便在元素的内容之前或之后插入计数器的值。

比如说

```html
<ol>
  <li>
    a // 1
    <ol>
      <li>b</li>
      // 1.1
      <li>c</li>
      // 1.2
      <li>d</li>
      // 1.3
    </ol>
  </li>
  <li>e</li>
  // 2
</ol>
```

```css
ol {
  counter-reset: list-item;
}

ol > li::marker {
  content: counters(list-item, ".") " ";
  counter-increment: list-item;
  color: #f44336;
}
```

#### 利用 couter 与 var 进行颜色渐变

```css
:root {
  --item-count: 3;
}

ul li {
  --hue: calc(var(--item-index) * 360 / var(--item-count));
  background-color: hsl(var(--hue), 70%, 60%);
}

ul li::before {
  counter-increment: item-index;
  content: counter(item-index);
}
```

### url('xxx.jpg')

可以是绝对路径（指向完整的互联网地址），也可以是相对路径（相对于当前 CSS 文件或 HTML 文件的位置

### var()

访问 css 自定义属性 （在整个文档或特定元素范围内可重复使用的值）

通过 var 来引用

```css
:root {
  --main-color: blue;
  --secondary-color: #333;
}
```

:root 选择器指向文档的根元素，意味着在全文档范围内可用

用 html 标签选择器也可以

```css
body {
  background-color: var(--main-color);
  color: var(--secondary-color);
}
```

var() 函数也可以接受一个可选的第二个参数，作为变量未定义时的兜底值

```css
body {
  background-color: var(--unknown-variable, red);
}
```

有利于在样式表中重复使用，动态改变样式，高级的样式逻辑和主题切换

### element(id 选择器)

直接把一个元素拿过来使用，比如作为背景

```css
#someOtherElement {
  background-image: element(#myElement);
}
```

### nth-child()

```css
:nth-child(-n + 3) {
  // 选择第一个到第三个
}

:nth-child(n + 3) {
  // 从第三个开始
}

:nth-child(-n + 9):nth-child(n + 6) {
  // 从第六个到第九个，取交集
}
```
