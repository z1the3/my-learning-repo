# props

## 基本

```js

const Button = styled.button<{ $primary?: boolean; }>`
  background: ${props => props.$primary ? "#BF4F74" : "white"};
  color: ${props => props.$primary ? "white" : "#BF4F74"};
`
    <Button $primary>Primary</Button>

```

## 两种写法

```js
//动态样式-标签模版字符串
//${F},F如果为函数，styled-components运行该函数时传入props参数（DynamicElements使用时传入的props,<DynamicElements size='12px'>）
const DynamicElements = styled.div`
  font-size: ${props => props.size};
`;
//动态样式-函数式写法且传参为函数，返回数据要求为样式对象
// 支持迁移
//（style属性写法迁移到styled-components时，可以使用这种写法）
const DynamicElementsF = styled.div(props => ({
  fontSize: props.size,
}));
<DynamicElements size='12px'>hello</DynamicElements>;
<DynamicElementsF size='12px'>hello</DynamicElements>;
```

如果 props.size 频繁变更为多个值，建议使用 style 属性而不是 styled-components
否则模版字符串每次运行都会创建一个新类名，损耗较大？

```js
React.useEffect(() => {
  setTimeout(() => {
    setCnt((cnt) => cnt + 1);
  }, 500);
}, [cnt]);
```
