# flex 布局

容器上

● flex-direction 属性决定主轴的方向（即项目的排列方向）。

● flex-wrap 属性定义，如果一条轴线排不下，如何换行。

● flex-flow 属性是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap。

● justify-content 属性定义了项目在主轴上的对齐方式。

● align-items 属性定义项目在交叉轴上如何对齐。

● align-content 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

以下 6 个属性设置在项目上：

● order 属性定义项目的排列顺序。数值越小，排列越靠前，默认为 0。

● flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。

● flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。

● flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空

间。它的默认值为 auto，即项目的本来大小。

● flex 属性是 flex-grow，flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。

● align-self 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。

## flex

flex 属性是 flex-grow，flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。flex:1 表示 flex: 1 1 0%：

● 第一个参数表示: flex-grow 定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大；

● 第二个参数表示: flex-shrink 定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小；

● 第三个参数表示: flex-basis 给上面两个属性分配多余空间之前, 计算项目是否有多余空间, 默认值为 auto, 即

项目本身的大小。
