# css

## 从右向左匹配

由于存在大量子节点，一开始匹配就能过滤掉很多不符合规则的子节点

匹配顺序：
`div span`
例如先找到所有的 span 节点，然后往上看是否在 div 节点中，如果不再或到达根元素则舍弃掉

## 动画

```css
@keyframes anim-1 {
  50% {
    border-radius: 50%;
  }
}
animation: anim-1 1s;
```

1. animation-name: 动画的名称，可以是自定义的或预设的动画名称
2. animation-duration: 动画的持续时间
3. animation-timing-function: 动画的缓动函数，用来控制动画的速度曲线
4. animation-delay: 动画的延迟时间，可以使动画在指定时间后开始
5. animation-iteration-count: 动画的播放次数，可以设置为无限循环播放
6. animation-direction: 动画的播放方向，可以是正向播放、反向播放、交替播放等
7. animation-fill-mode: 动画的填充模式，用来控制动画在播放前后的状态，可以设置为保持最后状态、保持初始状态等
8. animation-play-state: 动画的播放状态，可以控制动画的暂停、播放等状态。
   这些属性可以单独使用，也可以组合使用来实现复杂的动画效果

## box-shadow

```css
/* Keyword values */
box-shadow: none;

/* A color and two length values */
/* <color> | <length> | <length> */
box-shadow: red 60px -16px;

/* Three length values and a color */
/* <length> | <length> | <length> | <color> */
box-shadow: 10px 5px 5px black;

/* Four length values and a color */
/* <length> | <length> | <length> | <length> | <color> */
box-shadow: 2px 2px 2px 1px rgb(0 0 0 / 20%);

/* inset, length values, and a color */
/* <inset> | <length> | <length> | <color> */
box-shadow: inset 5em 1em gold;

/* Any number of shadows, separated by commas */
box-shadow: 3px 3px red inset, -1em 0 0.4em olive;

/* Global values */
box-shadow: inherit;
box-shadow: initial;
box-shadow: revert;
box-shadow: revert-layer;
box-shadow: unset;
```

```
两个、三个或四个<length>值。
如果仅给出两个值，它们将被解释为<offset-x>和<offset-y>值。阴影面积是块元素
如果给出第三个值，则将其解释为<blur-radius>。
如果给出第四个值，则将其解释为<spread-radius>。
可选的 inset 关键字。
可选的，一个<color>值。
```
