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

#

## 自适应正方形

```js
<!-- 第一种方案,利用vw  -->
<style>
  .container{
    width: 50%;
    background: #ccc;
    height: 50vw;
  }
</style>

<body>
  <div class="container"></div>
</body>


<!-- 第二种方案,利用padding-top  -->
<style>
  .container {
    width: 50%;
    /* 该元素真实高度为0，我们看到的只是它往下偏移而露出的padding背景色 */
    /* padding-top后的百分比以父容器**宽度**为准 */
    padding-top: 50%;
    height: 0;

    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    background-color: antiquewhite;
  }
</style>

<body>
  <div class="container">
  </div>
</body>
```
