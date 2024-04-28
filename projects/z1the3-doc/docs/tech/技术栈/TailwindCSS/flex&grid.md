# flex&gird

## basis

控制弹性项目的初始大小

```
basis-3/6 flex-basis: 50%;
basis-14 flex-basis: 3.5rem; /* 56px */
basis-0 flex-basis: 0px;
basis-full flex-basis: 100%;
```

## direction

```
flex-row flex-direction: row;
flex-row-reverse flex-direction: row-reverse;
flex-col flex-direction: column;
flex-col-reverse flex-direction: column-reverse;
```

## wrap

```
flex-wrap flex-wrap: wrap;
flex-wrap-reverse flex-wrap: wrap-reverse;
flex-nowrap flex-wrap: nowrap;
```

## flex

flex1 很重要，因为可以伸展

```
flex-1 flex: 1 1 0%;
flex-auto flex: 1 1 auto;
flex-initial flex: 0 1 auto; // 默认
flex-none flex: none;
```

### flex grow

微调

```
grow flex-grow: 1;
grow-0 flex-grow: 0;
```

### flex shrink

```
shrink flex-shrink: 1;
shrink-0 flex-shrink: 0;
```

## order

控制 flex 项目（以及 grid 项目！）的顺序

```
order-9 order: 9;
order-10 order: 10;
order-11 order: 11;
order-12 order: 12;
order-first order: -9999;
order-last order: 9999;
order-none order: 0;
```

## grid

### grid template columns

控制 grid 布局的列

```
grid-cols-10 grid-template-columns: repeat(10, minmax(0, 1fr));
grid-cols-11 grid-template-columns: repeat(11, minmax(0, 1fr));
grid-cols-12 grid-template-columns: repeat(12, minmax(0, 1fr));
grid-cols-none grid-template-columns: none;
grid-cols-subgrid grid-template-columns: subgrid;
```

### gird column start/end

自定义某一行的起始和结束位置

```html
<div class="grid grid-cols-3 gap-4">
  <div class="...">01</div>
  <div class="...">02</div>
  <div class="...">03</div>
  <div class="col-span-2 ...">04</div>
  <div class="...">05</div>
  <div class="...">06</div>
  // 第七项同时占据了第二列和第三列
  <div class="col-span-2 ...">07</div>
</div>
```

```
col-auto grid-column: auto;
col-span-1 grid-column: span 1 / span 1;
col-span-2 grid-column: span 2 / span 2;
col-span-3 grid-column: span 3 / span 3;
col-span-4 grid-column: span 4 / span 4;
col-span-5 grid-column: span 5 / span 5;
col-span-6 grid-column: span 6 / span 6;
col-span-full grid-column: 1 / -1;
col-start-1 grid-column-start: 1;
col-start-2 grid-column-start: 2;
col-start-3 grid-column-start: 3;
```

### grid template rows 同理

### grid row start/end 同理

## grid auto flow

控制容器内项目怎么排列的

dense
该关键字指定自动布局算法使用一种“稠密”堆积算法，如果后面出现了稍小的元素，则会试图去填充网格中前面留下的空白。这样做会填上稍大元素留下的空白，但同时也可能导致原来出现的次序被打乱

如果省略它，使用一种「稀疏」算法，在网格中布局元素时，布局算法只会「向前」移动，永远不会倒回去填补空白。这保证了所有自动布局元素「按照次序」出现，即使可能会留下被后面元素填充的空白。

```
grid-flow-row grid-auto-flow: row;
grid-flow-col grid-auto-flow: column;
grid-flow-dense grid-auto-flow: dense;
grid-flow-row-dense grid-auto-flow: row dense;
grid-flow-col-dense grid-auto-flow: column dense;
```

## grid auto columns/rows

控制隐式创建的行和列大小

```
auto-cols-auto grid-auto-columns: auto;
auto-cols-min grid-auto-columns: min-content;
auto-cols-max grid-auto-columns: max-content;
auto-cols-fr grid-auto-columns: minmax(0, 1fr);
```

## gap

控制 grid 和 flex 容器项目之间的距离

```
gap-0 gap: 0px;
gap-x-0 column-gap: 0px;
gap-y-0 row-gap: 0px;
gap-px gap: 1px;
gap-x-px column-gap: 1px;
gap-y-px row-gap: 1px;
gap-0.5 gap: 0.125rem; /* 2px */
gap-x-0.5 column-gap: 0.125rem; /* 2px */
```

## justify content

控制每个子项目在整个容器的按什么方式留 gap

around 和 evenly 边缘都有留空，但是 evenly 边缘留空了两倍间距
normal 就是默认

```
justify-normal justify-content: normal;
justify-start justify-content: flex-start;
justify-end justify-content: flex-end;
justify-center justify-content: center;
justify-between justify-content: space-between;
justify-around justify-content: space-around;
justify-evenly justify-content: space-evenly;
justify-stretch justify-content: stretch;
```

## justify items

控制每个子项目在自己的可扩展范围内从哪开始 justify
支持左中右和自动扩展

```
justify-items-start justify-items: start;
justify-items-end justify-items: end;
justify-items-center justify-items: center;
justify-items-stretch justify-items: stretch;
```

## justify self

justify items 能直接控制所有子项目
justify self 单独定制子项目
设为 auto 即不定制，跟随 items 设定

```
justify-self-auto justify-self: auto;
justify-self-start justify-self: start;
justify-self-end justify-self: end;
justify-self-center justify-self: center;
justify-self-stretch justify-self: stretch;
```

## align content

控制副轴上的排列方式，start end center 主轴上整体的一堆会一起移动
其他的能控制副轴上每一区块的 gap

```
content-normal align-content: normal;
content-center align-content: center;
content-start align-content: flex-start;
content-end align-content: flex-end;
content-between align-content: space-between;
content-around align-content: space-around;
content-evenly align-content: space-evenly;
content-baseline align-content: baseline;
content-stretch align-content: stretch;
```

## align items

控制单个项目在可伸展副轴方向的表现

```
items-start align-items: flex-start;
items-end align-items: flex-end;
items-center align-items: center;
items-baseline align-items: baseline;
items-stretch align-items: stretch;
```

## align self

```
self-auto align-self: auto;
self-start align-self: flex-start;
self-end align-self: flex-end;
self-center align-self: center;
self-stretch align-self: stretch;
self-baseline align-self: baseline;
```

## place content

一次控制 justify 和 align content

```
place-content-center place-content: center;
place-content-start place-content: start;
place-content-end place-content: end;
place-content-between place-content: space-between;
place-content-around place-content: space-around;
place-content-evenly place-content: space-evenly;
place-content-baseline place-content: baseline;
place-content-stretch place-content: stretch;
```

## place items

同理

## place self

同理
