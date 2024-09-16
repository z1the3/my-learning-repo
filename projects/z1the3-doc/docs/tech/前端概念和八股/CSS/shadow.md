# shadow

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
