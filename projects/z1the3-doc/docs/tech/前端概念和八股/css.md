# css

## 从右向左匹配

由于存在大量子节点，一开始匹配就能过滤掉很多不符合规则的子节点

匹配顺序：
`div span`
例如先找到所有的 span 节点，然后往上看是否在 div 节点中，如果不再或到达根元素则舍弃掉

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
