# css 效果

## 1.实现三角形

分别通过 border 线性渐变 clip-path 实现

import Triangles from '@site/src/components/Triangle'

<Triangles/>

```css
.container {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.tri1 {
  border-style: solid;
  border-color: transparent;
  border-width: 50px;
  border-left-color: skyblue;
  height: 50px;
}

.tri2 {
  width: 160px;
  height: 200px;
  outline: 2px solid skyblue;
  background-repeat: no-repeat;
  background-image: linear-gradient(
      32deg,
      orangered 50%,
      rgba(255, 255, 255, 0) 50%
    ), linear-gradient(148deg, orangered 50%, rgba(255, 255, 255, 0) 50%);
  background-size: 100% 50%;
  background-position: top left, bottom left;
}

.tri3 {
  width: 160px;
  height: 200px;
  background-color: skyblue;
  clip-path: polygon(0 0, 0% 100%, 100% 50%);
}
```

## 2.单行，多行文本溢出

单行

```css
overflow: hidden; // 溢出隐藏
text-overflow: ellipsis; // 溢出用省略号显示
white-space: nowrap; // 规定段落中的文本不进行换行
```

多行

```css
overflow: hidden; // 溢出隐藏
text-overflow: ellipsis; // 溢出用省略号显示
display: -webkit-box; // 作为弹性伸缩盒子模型显示。
-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
-webkit-line-clamp: 3; // 显示的行数
```

注意：由于上面的三个属性都是 CSS3 的属性，没有浏览器可以兼容，所以要在前面加一个-webkit- 来兼容一部分浏览器。

## 九宫格

```html
<div class="container">
  <div class="item a">A</div>
  <div class="item b">B</div>
  <div class="item c">C</div>
  <div class="item d">D</div>
  <div class="item e">E</div>
  <div class="item f">F</div>
  <div class="item g">G</div>
  <div class="item h">H</div>
  <div class="item i">I</div>
</div>
```

```css
.item {
  background-color: #bfebfe;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  display: grid; /* 注意ABC
竖着排,所以是column */
  grid-auto-flow: column;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr); /* * */
  gap: 10px;
}
```

### flex 写法

```css
九宫格布局 ul 设置flex-wrap
九个li设置width30%height30% margin-right:5% margin-bottom:5%
由于最后一行不需要下边距，最后一列不需要右边距
li:nth-of-type(3n)的margin-right设为0   (3,6,9)
li:nth-of-type(n+7)的margin-bottom设为0 (7,8,9)

```
