# layout utility 速查

## 布局

### aspect ratio

控制元素横纵比

```html
<iframe
  class="w-full aspect-video ..."
  src="https://www.youtube.com/..."
></iframe>
```

Class Properties
aspect-auto aspect-ratio: auto;
aspect-square aspect-ratio: 1 / 1;
aspect-video aspect-ratio: 16 / 9;

### container

固定一个元素的最大尺寸

```
sm:container
md:container
lg:container
xl:container
2xl:container
```

Tailwind 的容器不会自动居中，也没有任何内置的水平填充。

```html
要将容器居中，请使用以下 mx-auto：
<div class="container mx-auto">
  <!-- ... -->
</div>

要添加水平填充，请使用以下px-*
<div class="container mx-auto px-4">
  <!-- ... -->
</div>
```

定制

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
};
```

### column

用于控制元素内的列数

列宽将自动调整以适应该数字

```html
<div class="columns-3 ...">
  <img class="w-full aspect-video ..." src="..." />
  <img class="w-full aspect-square ..." src="..." />
  <!-- ... -->
</div>
```

### break after/break before/break inside

控制列或页面在元素之后，之前，内部如何分隔

https://tailwindcss.com/docs/break-after
https://tailwindcss.com/docs/break-before
https://tailwindcss.com/docs/break-inside

```html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-after-column">Sure, go ahead, laugh...</p>
  <p>Maybe we can live without...</p>
  <p>Look. If you think this is...</p>
</div>
```

### Box Decoration Break

盒（背景）装饰中断或连续

前者被 br 分隔后，背景渐变色被分成两块
后者被 br 分隔后，背景渐变色被分成两块，但是保持线性连续

```html
<span
  class="box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2 ..."
>
  Hello<br />
  World
</span>
<span
  class="box-decoration-clone bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2 ..."
>
  Hello<br />
  World
</span>
```

### Box Sizing

```
box-border
box-content
```

### Display

```
block display: block;
inline-block display: inline-block;
inline display: inline;
flex display: flex;
inline-flex display: inline-flex;
table display: table;
inline-table display: inline-table;
table-caption display: table-caption;
table-cell display: table-cell;
table-column display: table-column;
table-column-group display: table-column-group;
table-footer-group display: table-footer-group;
table-header-group display: table-header-group;
table-row-group display: table-row-group;
table-row display: table-row;
flow-root display: flow-root;
grid display: grid;
inline-grid display: inline-grid;
contents display: contents;
list-item display: list-item;
hidden display: none;
```

## Floats

图片配文字

```
float-start float: inline-start; // 逻辑属性，受rtl影响
float-end float: inline-end;
float-right float: right;
float-left float: left;
float-none float: none;
```

如果不开启 float-right，图片和文字会像块元素一样上下分离

```html
<img class="float-right ..." src="path/to/image.jpg" />
<p>Maybe we can live without libraries, people like you and me. ...</p>
```

## Clear

清除浮动

```
clear-start clear: inline-start;
clear-end clear: inline-end;
clear-left clear: left;
clear-right clear: right;
clear-both clear: both;
clear-none clear: none;
```

## Object Fit

控制图片标签
contain: 改变高，不会全覆盖，破坏比例
cover: 同时改变宽高直到覆盖元素（破坏比例）
fill: 改变宽，会全覆盖，破坏比例
none: 保持图片原大小，不做处理
scale-down: 不破坏比例，也不会超出元素范围，自适配

```
object-contain object-fit: contain;
object-cover object-fit: cover;
object-fill object-fit: fill;
object-none object-fit: none;
object-scale-down object-fit: scale-down;
```

```html
<div class="bg-indigo-300 ...">
  <img class="object-cover h-48 w-96 ..." />
</div>
```

## Object position

容器中点对应图片上的位置，不会溢出，刚好贴边

```js
object-bottom object-position: bottom;
object-center object-position: center;
object-left object-position: left;
object-left-bottom object-position: left bottom;
```

## Overflow

```js
overflow-auto overflow: auto; //只有真容纳不下才会显示scrollbar
overflow-hidden overflow: hidden; // 超出直接剪掉，原内容尽量不保留
overflow-clip overflow: clip; // 超出直接剪掉，原内容尽量保留
overflow-visible overflow: visible;
overflow-scroll overflow: scroll; // 一直显示srollbar
overflow-x-auto overflow-x: auto;
overflow-y-auto overflow-y: auto;
overflow-x-hidden overflow-x: hidden;
overflow-y-hidden overflow-y: hidden;
overflow-x-clip overflow-x: clip;
overflow-y-clip overflow-y: clip;
overflow-x-visible overflow-x: visible;
overflow-y-visible overflow-y: visible;
overflow-x-scroll overflow-x: scroll;
overflow-y-scroll overflow-y: scroll;
```

## Overscroll Behavior

子容器滚动到底部后，继续滚动触发父容器滚动

以及滚动到底的反弹效果

## Position

绝对定位是相对最近开启相对定位的元素
并不一定是父级元素

static position: static;
fixed position: fixed;
absolute position: absolute;
relative position: relative;
sticky position: sticky;

## Top/Right/Bottom/Left

Inset 用于框高不定元素的 span 和 fill （扩展）

```ini
如inset-y-3.5

top: 0.875rem; /* 14px */
bottom: 0.875rem; /* 14px */
```

inset-0 inset: 0px;
inset-x-0 left: 0px; right: 0px;
inset-y-0 top: 0px; bottom: 0px;
start-0 inset-inline-start: 0px;
end-0 inset-inline-end: 0px;
top-0 top: 0px;
right-0 right: 0px;
bottom-0 bottom: 0px;
left-0 left: 0px;
inset-px inset: 1px;
inset-x-px left: 1px; right: 1px;
inset-y-px top: 1px; bottom: 1px;
start-px inset-inline-start: 1px;
end-px inset-inline-end: 1px;
top-px top: 1px;
right-px right: 1px;
bottom-px bottom: 1px;
left-px left: 1px;
inset-0.5 inset: 0.125rem; /_2px _/
inset-x-0.5 left: 0.125rem; /_ 2px_/ right: 0.125rem; /_2px_/

left-auto left: auto;
left-1/2 left: 50%;
left-1/3 left: 33.333333%;
left-2/3 left: 66.666667%;
left-1/4 left: 25%;
left-2/4 left: 50%;
left-3/4 left: 75%;
left-full left: 100%;

```html
<!-- Span top edge -->
<div class="relative h-32 w-32 ...">
  <div class="absolute inset-x-0 top-0 h-16 ...">02</div>
</div>

<!-- Pin to top right corner -->
<div class="relative h-32 w-32 ...">
  <div class="absolute top-0 right-0 h-16 w-16 ...">03</div>
</div>

<!-- Span left edge -->
<div class="relative h-32 w-32 ...">
  <div class="absolute inset-y-0 left-0 w-16 ...">04</div>
</div>

<!-- Fill entire parent -->
<div class="relative h-32 w-32 ...">
  <div class="absolute inset-0 ...">05</div>
</div>

<!-- Span right edge -->
<div class="relative h-32 w-32 ...">
  <div class="absolute inset-y-0 right-0 w-16 ...">06</div>
</div>

<!-- Pin to bottom left corner -->
<div class="relative h-32 w-32 ...">
  <div class="absolute bottom-0 left-0 h-16 w-16 ...">07</div>
</div>

<!-- Span bottom edge -->
<div class="relative h-32 w-32 ...">
  <div class="absolute inset-x-0 bottom-0 h-16 ...">08</div>
</div>

<!-- Pin to bottom right corner -->
<div class="relative h-32 w-32 ...">
  <div class="absolute bottom-0 right-0 h-16 w-16 ...">09</div>
</div>
```

### 负值

```html
<div class="relative h-32 w-32 ...">
  <div class="absolute h-14 w-14 -left-4 -top-4 ..."></div>
</div>
```

### logical start

```js
<div dir="ltr">
  <div class="relative h-32 w-32 ...">
    <div class="absolute h-14 w-14 top-0 start-0 ..."></div>
  </div>
<div>

<div dir="rtl">
  <div class="relative h-32 w-32 ...">
    <div class="absolute h-14 w-14 top-0 start-0 ..."></div>
  </div>
<div>
```

### visibility

使用 collapse 隐藏表行、行组、列和列组，就像将它们设置为 display: none 一样，但不会影响其他行和列的大小。

这使得动态切换行和列成为可能，而不影响表布局。

```
visible visibility: visible;
invisible visibility: hidden;
collapse visibility: collapse;
```

### z-index

```
z-0 z-index: 0;
z-10 z-index: 10;
z-20 z-index: 20;
z-30 z-index: 30;
z-40 z-index: 40;
z-50 z-index: 50;
z-auto z-index: auto;
```

负 z-index

```html
<div class="-z-50">
  <!-- ... -->
</div>
```
