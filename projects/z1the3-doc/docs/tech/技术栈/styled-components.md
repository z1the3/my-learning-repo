# Styled Components

https://styled-components.com/docs/basics#motivation

## 使用动机

**该库仅适用于react**

* 自动生成关键css
*自动*跟踪哪些组件渲染在页面上（运行时），然后向其注入样式
结合代码分割，只加载关键css

* 类名命名问题

自动生成独一无二的类名，不用担心重复声明，类名覆盖和错误拼写

* css删除更容易

传统css和html割裂，很难知道类名是否被使用

使用styled-component，类名能显式对应到组件

不必要的可以直接删除

* 简单的动态样式

控制组件props和全局主题就能实现样式动态切换

不用手动管理大量类

* 无痛维护成本

不用在多个不同css文件之间进行维护

* css属性自动添加供应商前缀

如webkit前缀

## 使用

```js
// Create a Title component that'll render an <h1> tag with some styles
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

// Use Title and Wrapper like any other React component – except they're styled!
render(
  <Wrapper>
    <Title>
      Hello World!
    </Title>
  </Wrapper>
);
```

### 基于props调整

```js

const Button = styled.button<{ $primary?: boolean; }>`
  background: ${props => props.$primary ? "#BF4F74" : "white"};
  color: ${props => props.$primary ? "white" : "#BF4F74"};
`
    <Button $primary>Primary</Button>

```

### 继承样式

`styled(Button)`

继承后可以编辑

```js
const Button = styled.button`
  color: #BF4F74;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;
`;

// A new component based on Button, but with some override styles
const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;
```

styled.xxx一般适用于简单原生标签

styled(xxx)一般适用于自定义react组件

## 动态更改标签

Button -> a 标签

```js
const Button = styled.button``

<Button as=“a" href="#">

```

常用于导航栏按钮和链接间的条件切换

---
组件也可以切换成自定义组件

```jsx
// xxx组件，但是拥有Button组件的样式
<Button as={xxx}>
```

### 支持第三方组件库

任何为元素传递className prop的组件都可以用styled覆盖

### 传递prop

styled-component封装的prop通过`$xxxx`传递

```js
    <Input defaultValue="@geelen" type="text" $inputColor="rebeccapurple" />
```

### 最佳实践

样式组件命名Styled+xxx

独立于渲染函数

```js
const StyledWrapper = styled.div`
  /* ... */
`;



const Wrapper = ({ message }) => {
  return <StyledWrapper>{message}</StyledWrapper>;
};

```

伪元素，伪选择器，嵌套

使用`&`访问组件自身实例

```js

const Thing = styled.div.attrs((/* props */) => ({ tabIndex: 0 }))`
  color: blue;

  &:hover {
    color: red; // <Thing> when hovered
  }

  & ~ & {
    background: tomato; // <Thing> as a sibling of <Thing>, but maybe not directly next to it
  }

  & + & {
    background: lime; // <Thing> next to <Thing>
  }

  &.something {
    background: orange; // <Thing> tagged with an additional CSS class ".something"
  }

  .something-else & {
    border: 1px solid; // <Thing> inside another element labeled ".something-else"
  }
`

render(
  <React.Fragment>
    <Thing>Hello world!</Thing>
    <Thing>How ya doing?</Thing>
    <Thing className="something">The sun is shining...</Thing>
    <div>Pretty nice day today.</div>
    <Thing>Don't you think?</Thing>
    <div className="something-else">
      <Thing>Splendid.</Thing>
    </div>
  </React.Fragment>
)


```

`&&` 只能拿到其中一个实例

```js
const Input = styled.input.attrs({ type: "checkbox" })``;

const Label = styled.label`
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`

const LabelText = styled.span`
  ${(props) => {
    switch (props.$mode) {
      case "dark":
        return css`
          background-color: black;
          color: white;
          ${Input}:checked + && {
            color: blue;
          }
        `;
      default:
        return css`
          background-color: white;
          color: black;
          ${Input}:checked + && {
            color: red;
          }
        `;
    }
  }}
`;

render(
  <React.Fragment>
    <Label>
      <Input defaultChecked />
      <LabelText>Foo</LabelText>
    </Label>
    <Label>
      <Input />
      <LabelText $mode="dark">Foo</LabelText>
    </Label>
    <Label>
      <Input defaultChecked />
      <LabelText>Foo</LabelText>
    </Label>
    <Label>
      <Input defaultChecked />
      <LabelText $mode="dark">Foo</LabelText>
    </Label>
  </React.Fragment>
)

```

---
单独的`&&`,用于防止自定义样式和全局自定义样式冲突

提升自定义样式的优先级

```js
const Thing = styled.div`
   && {
     color: blue;
   }
 `

// 所有div且thing标签
 const GlobalStyle = createGlobalStyle`
   div${Thing} {
     color: red;
   }
 `

```

### .attrs 附带额外props

这里我们附带了一个`type`静态props

重新定义了一次`$size`props

```js
通过{props => props.$size};引用
```

```js
const Input = styled.input.attrs<{ $size?: string; }>(props => ({
  // we can define static props
  type: "text",

  // or we can define dynamic ones
  $size: props.$size || "1em",
}))`
  color: #BF4F74;
  font-size: 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;

  /* here we use the dynamically computed prop */
  margin: ${props => props.$size};
  padding: ${props => props.$size};
`;

render(
  <div>
    <Input placeholder="A small text input" />
    <br />
    <Input placeholder="A bigger text input" $size="2em" />
  </div>
);

```

在.attrs声明组件后再次使用.attrs能继承再覆盖之前的样式

### 动画

引入rotate，作为变量用在样式组件的模版字符串中

```js
// Create the keyframes
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

// Here we create a component that will rotate everything we pass in over two seconds
const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 1.2rem;
`;

render(
  <Rotate>&lt; 💅🏾 &gt;</Rotate>
);


```
