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
