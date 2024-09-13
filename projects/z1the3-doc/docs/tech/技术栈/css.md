# css 进阶

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

### CSS 快速方案

通过 js 往 body 中动态注入 lang 信息，在 css 中可以通过 lang() 选择器来获取对应的个性化样式

```js
// index.js
// 中文document.body.lang = 'zh'
// 英文document.body.lang = 'en'
```

```css
.less.container {
  &:lang(zh) {
    flex-direction: row;
  }
  &:lang(en) {
    flex-direction: column;
  }
}
```
