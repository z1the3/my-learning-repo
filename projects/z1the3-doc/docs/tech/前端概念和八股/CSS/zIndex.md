# zIndex(涉及层叠上下文)

在日常工作中，我们经常使用 z-index 配合 position 属性来控制元素的遮盖顺序。

z-index 值越大，所属元素越靠上

```html
<style>
  .header {
    position: relative;
    z-index: 2;
  }
  .main {
    position: relative;
    z-index: 1;
  }
  .tooltip {
    position: absolute;
    z-index: 999999;
  }
</style>

<div class="header">Welcome!</div>
<div class="main">
  <div class="tooltip">Tooltip</div>
</div>
```

已经给 Tooltip 一个很大的 z-index 了，并且所有元素都已经具备 position:relative/absolute 了，为什么 Tooltip 被我们的 header 挡住了？

每个元素就是一层，每个具有 position 和 z-index 的元素会创建一个层叠上下文，层叠上下文就是元素的组，当我们给一个元素设置 z-index 的时候，它只会和同组的元素比较值

而回到 CSS 来，我们就非常好类比了。
默认情况下，HTML 中 html 标签就是最初的层叠上下文，包含所有的元素，而我们在其中嵌套创建了新的层叠上下文。创建层叠上下文的方式多种多样，但最普遍的就是我们的 position+z-index。

如果一个元素没有创建层叠上下文（不在任何层叠上下文中），那么它的优先级低于一切带有层叠上下文的同级元素。

回到我们刚才的例子：

可以梳理出来层叠上下文是这样的

```
- html
  - div.header[z-index=2]
  - div.main[z-index=1]
     - div.tooltip[z-index=999999]
```

用`semver`的方式思考。tooltip 的 z-index 可以看做版本 1.999999，而 header 的版本是 2。无论小版本号多么庞大，那也永远比大版本号要小。所以 `1.999999<2`，tooltip 在下方。

所以怎么修复就非常显而易见了：一种方式是不给 main 设置 z-index，让其退化为普通元素，普通元素默认层级较低

```html
<style>
  .header {
    position: relative;
    z-index: 2;
  }
  .main {
    position: relative;
    // No more z-index here!
    // z-index: 1;
  }
  .tooltip {
    position: absolute;
    z-index: 999999;
  }
</style>
```

二是将 tooltip 提升，渲染到 body 中， tootip 外不需要 main 包裹

```
- html
  - div.header[z-index=2]
  - div.tooltip[z-index=999999]
我们无需关心DOM上的层级关系，浏览器渲染时只关心层叠上下文。
```

- 层叠上下文可以包含在其他层叠上下文中，并且一起创建一个层叠上下文的层级。
- 每个层叠上下文都完全独立于它的兄弟元素：当处理层叠时只考虑子元素。
- 每个层叠上下文都是自包含的：当一个元素的内容发生层叠后，该元素将被作为整体在父级层叠上下文中按顺序进行层叠。

```
文档中新的层叠上下文由满足以下任意一个条件的元素形成：
- 文档根元素（<html>）
- position 值为 absolute或 relative且 z-index 值不为 auto 的元素
- position 值为 fixed或 sticky的元素（沾滞定位适配所有移动设备上的浏览器，但老的桌面浏览器不支持）
- flex 容器的子元素，且 z-index 值不为 auto
- grid容器的子元素，且 z-index 值不为 auto
- opacity 属性值小于 1 的元素（参见 the specification for opacity）
- mix-blend-mode 属性值不为 normal 的元素
- 以下任意属性值不为 none 的元素：
  - transform
  - filter
  - backdrop-filter
  - perspective
  - clip-path
  - mask / mask-image / mask-border
- isolation 属性值为 isolate 的元素
- will-change 值设定了任一属性而该属性在 non-initial 值时会创建层叠上下文的元素（参考这篇文章）
- contain 属性值为 layout、paint 或包含它们其中之一的合成值（比如 contain: strict、contain: content）的元素。
```

## 层叠顺序

```
    .first{
      position: relative;
    }
    .second{
        margin-top:-15px;
        background-color: orangered;
    }

```

first 在 second 上方

如果层叠上下文元素不注明 z-index 数值，则其层叠顺序是 z-index:auto，可看成 z-index:0 级别。这就是为什么定位元素会覆盖在普通元素上

—在定位后 z-index 已经被认为生效了，虽然没有创建新的层叠上下文，但是在上一级的比较中已经占了上风。

但如果同级元素拥有相同的 z-index，这时候遵循栈的思想。

## 练习

这是一道 MDN 的例子，我们用之前的思考方式来验证一下。

https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context_example_1

https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context_example_2

## 常见误区

从上面章节创建中我们可以发现，有些时候 z-index 并不需要 position 来工作，比如第四条中的 flex 的子元素，我们来举个例子。

第二个盒子并没有任何 position 设置，但是在父元素 flex 的影响下，第二个盒子已经单独成为了一个层叠上下文，这让他的层叠顺序来到了其余两个盒子下方

```css
.wrapper {
  display: flex;
}
.second.box {
  z-index: -1;
  background: cyan;
  margin-top: 20px;
  margin-left: -20px;
  margin-right: -20px;
}
```

此外，我们常用的渐显隐动画也可能给我们造成些许麻烦，请看这个例子：

```css
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.box {
  position: relative;
}
.text {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}

.fade {
  -webkit-animation: fadeIn 2s 2s infinite;
  animation: fadeIn 2s 2s infinite;
}
```

我们发现我们实现的渐显动画一旦开始执行标题就被放到图片后方了。这就是上文提到的 opacity 不为 1 导致的创建层叠上下文问题。当动画进行中时层叠上下文被创建、z-index 就被置为 auto 了，而这和使用绝对定位的文字来到了同一优先级。而又由于后来者居上的原则，图片就会覆盖到文字上方了。对于这个例子，我们只需要给 text 添加 z-index 或者调换两者的 DOM 顺序即可解决问题。
opacity 会创建层叠上下文的原因在 CSS Color Module Level 3 有提到，为了确保透明元素和其内容间没有其他外部内容插入，opacity 需要将透明元素及其子元素单独绘制。这不就是层叠上下文的思想嘛！所以浏览器会将透明元素及其子元素绘制到一个单独的离屏位图中，再将这个位图绘制到屏幕中，实现预期效果

再有，层叠上下文和 overflow 的搭配也是需要注意的。因为大多层叠上下文都使用 position 来限定，这会导致可能即使 z-index 设置的很大，但是由于元素超出了父元素的范围而被截断从而导致 z-index 的设置无效。就像这个例子。下方浮层是 relative 的，弹框是 absolute 的，那么给浮层加上 overflow 之后弹框无法超出浮层限定范围，于是被截断了。

## isolation:isolate 是什么？

这个属性单看名字和值可能会让人很困惑。因为它也不是单独应用的，它一般是配合 mix-blend-mode 使用的。isolation 隔离，隔离的就是元素间的混合（颜色）。
MDN 出错了，内里介绍是配合 background-blend-mode 使用，但该属性天生是一个封闭的混合领域，不会影响其他元素。只有 mix-blend-mode 需要隔离。
当元素应用了混合的时候，默认情况下，
**其会混合 z 轴上所有层叠顺序比其低的层叠元素。如下例。**

横向的图片不仅被纵向的图片混合了，而且被背景混合了。我们只想让两个图片混合的话，只需要在 inner 容器上加上 isolation:isolate 即可。
这个属性只做了一件事：给当前元素创建层叠上下文。也就是说任何可以创建层叠上下文的方法放到 inner 身上都可以实现阻断的效果。不过其他属性多多少少都会对布局带来一些其他影响，但 isolation 属性只做了这么一件事，所以很适合涉及到 z-index 的组件用其封装来重新复用的场景。

## 如何调试层叠上下文？

1. 不算准确的方法：HTMLElement.offsetParent
   offsetParent 返回元素最近的、具有非 static 值的 position 的祖先。也就是其会收集 relative/absolution/sticky/fixed 的祖先。
   根据上文介绍，我们知道不是所有的层叠上下文会使用 position 进行定位。这就导致这个方法不是灵丹妙药，不能过于依赖。但对于常见的情况这个属性应该是足够带来一些启发的。
2. Microsoft Edge DevTools - 3D 视图
   这是 Edge 一个有趣的尝试，它用可视化的方式展现了页面整体的层叠情况，非常直观。但是它的缺点也很致命：我们很难从这个视图中定位出一个具体的元素，尤其是元素很小的时候。这个转动的交互还是有一点点折磨的。
3. Chrome Extension - CSS Stacking Context inspector

## 参考

https://www.joshwcomeau.com/css/stacking-contexts/
https://juejin.cn/post/6844903667175260174
https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context
https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/
