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

## 居中

### 水平居中

#### 1.子元素行内元素

```html
<div class="container">
  <span class="content">水平居中</span>
</div>
```

- `text-align`

text-align 一般运用在块级元素中，使其中的文本对齐。实际上，运用在块级元素中的 text-align 会使其包含的内联元素**水平**对齐

```css
.container {
  text-align: center;
}
```

#### 2.子元素块级元素

```html
<div class="container">
  <div class="content">水平居中</div>
</div>
```

- margin
  如果块元素的高度和宽度已知，就可以通过将元素的左右 margin 值设置为 auto 将元素水平居中：

```css
.content {
  width: 100px;
  height: 100px;
  margin-left: auto;
  margin-right: auto;
}
```

如果有多个块元素，需要将多个元素包裹在一个元素中以使用该方法实现水平居中：

```html
<div class="container">
  <div class="box">
    <div class="content">水平居中</div>
    <div class="content">水平居中</div>
  </div>
</div>
```

```css
.box {
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
```

### 水平垂直居中

```html
<div class="container">
  <div class="content">水平垂直居中</div>
</div>
```

#### 绝对定位

使元素垂直居中最通用的方法就是使用绝对定位和 transform：

```css
.container {
  position: relative;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

如果元素的高度和宽度已知，也可以使用 margin 来代替 transform:

```css
.container {
  position: relative;
}

.content {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
}
```

#### Flex 布局

在使用 Flex 布局时，可以结合上面的水平和垂直居中来实现水平垂直居中：

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### Grid 布局

```css
.container {
  display: grid;
  place-items: center;
}
```

place-content 属性是 align-content 和 justify-content 的简写，

当该属性的值为 center 时，所有的子元素堆叠在父元素的中间对齐。

## 透明

rgba()和 opacity 都能实现透明效果，但最大的不同是 opacity 作用于元素，以及元素内的所有内容的透明度，而 rgba()只作用于元素的颜色或其背景色。 （设置 rgba 透明的元素的子元素不会继承透明效果！）

## Position

position 的取值：static(默认) relative absolute sticky

staic-默认位置；元素会像通常那样流入页面。顶部，底部，左，右，z-index 属性不适用。
relative-元素的位置相对于自身进行调整，而不改变布局（从而为未被定位的元素留下一个空白）。
absolute-该元素从页面的流中移除，并相对于其最近位置的祖先定位（非 static）在指定位置，如果有的话，或者与初始包含块相对。绝对定位的框可以有边距，并且不会与其他边距折叠。这些元素不影响其他元素的位置。
fixed 元素是定位在相对于窗口。
sticky，是相对定位和固定定位的混合。该元素被视为相对位置，直到它越过指定的阈值，此时它被视为固定位置

## 解决 css 像素和物理像素不一致

对于不同分辨率的屏幕，如 4K HD 显示器和 Apple 的 Retina 显示器，在每一个网格中可以显示更多的像素，在这种情况下，为了使图像在这些屏幕上看起来不错，源文件需要大得多是用于常规显示器的图像大小的两倍，三倍甚至四倍。

处理高分辨率屏幕的一种方法是简单地提供最大的图像，低分辨率和小尺寸的屏幕可以毫无问题地显示高分辨率的大图像。但是这对于服务器或客户端或低分辨率的用户来说，都是一个非常差的体验。我们希望的是，不管是高分辨率还是低分辨率，都可以根据设备来选择使用不同的图片源，那么，在 web 端又是如何实现它的呢，且让我们继续向下看。

更好的解决方案：提供不同的图像
我们真正想做的是为每个用户都提供最大的可用图片：在高分辨率下，则为他们提供高分辨率的图像，对于手机用户或者低分辨率用户，我们则为他们提供较小的图像。

srcset：提供多图像源
首先，你需要为同一图像创建几个不同大小的版本。通常都希望为每个图像创建至少四个版本：“正常”尺寸的一个，然后再以两倍大小（2x），三倍（3x）和四倍（4x）来创建。创建图像时，将大小规格附加到每个文件会很有帮助：

```
image-1x.png
image-2x.png
image-3x.png
image-4x.png
```

这对浏览器没有任何影响，但会让编码更加易懂。另外，你可以创建更多不同大小（更大，更小）的图片版本，并且 srcset 属性中指定的源文件数量没有限制。

```html
<img
  src="/static/image.png"
  srcset="
    /static/image-4x.png 4x,
    /static/image-3x.png 3x,
    /static/image-2x.png 2x,
    /static/image-1x.png 1x
  "
/>
```

sizes：用媒体查询方法来指定图像宽度
通常情况下，我们会通过指定不同的图像宽度（以像素为单位）来告诉浏览器当前设备应该使用哪个图片源。因为它为浏览器提供了更多的有关图像的信息，因此可以更好地决定选择哪个图像。

对于图像宽度，请使用 w 而不是 x。

```html
// 使用到了媒体查询
<img
  src="https://cloud4.gogoing.site/files/2020-08-21/bbc63bf5-6f56-4d0a-a996-72fff804725c.png"
  sizes="(max-width: 376px) 375px, (max-width: 769px) 768px, 1024px"
  srcset="
    https://cloud3.gogoing.site/files/2020-08-21/bbc63bf5-6f56-4d0a-a996-72fff804725c.png  375w,
    https://cloud2.gogoing.site/files/2020-08-21/69d2679d-eefe-434a-8755-7f8b09166bf3.png  768w,
    https://cloud1.gogoing.site/files/2020-08-21/291087d7-beda-402f-9c28-b23e71beb32e.png 1024w
  "
/>

这里我们使用了三种规格的图片来演示，分别是：375px, 768px 以及 1024px
的图片（左上角标示）。 sizes 用来表示尺寸临界点，主要跟响应式尺寸有关。其语法为
sizes=“[media query] [value], [media query] [value] …
etc”，这里所有的值都是指宽度值，且单位任意可以为 PX, VW, EM 甚至是 CSS3
中的计算值 CALC，这里的 sizes 属性表述为：表示当屏幕不大于 376px
时，图片宽度按照 375px 来计算（计算方式见下一条），当屏幕不大于 769px
时，图片宽度按照 1024px 来计算，其余屏幕按照 1024px 来计算。 这里使用的 w
作为宽度描述符，其与 sizes 属性和屏幕密度比（devicePixelRatio）密切相关。比如：
在普通的 PC 电脑上，屏幕像素比是 1，sizes 属性计算值为 375px，那么，img
的实际宽度为 375*1=375w，因此，浏览器会加载 375px 这张图片。 在 iphone678
这类机型中，屏幕像素比是 2，sizes 属性计算值为 375px，那么，img 的实际宽度为
375*2=750w，此时，375w < 750w < 768w, 因此，浏览器会加载 768px 这张图片。 iphone
plus 和 iphone X 这类机型中，屏幕像素比是 3，sizes 属性计算值为 375px，那么，img
的实际宽度为 375\*3=1125w，此时，浏览器会加载 1024px 这张图片
```

> 参考 https://zhuanlan.zhihu.com/p/197567126

## 布局

### grid 布局

默认值是 row!

```css
.wrapper {
  display: grid;
  grid-template-columns: 200px 200px 200px;
}
```

#### fr 单位

轨道可以使用任何长度单位进行定义。网格还引入了一个另外的长度单位来帮助我们创建灵活的网格轨道。新的 fr 单位代表网格容器中可用空间的一部分。下一个网格定义将创建三个等宽的轨道，并根据可用空间的大小进行增减。

```css
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```
