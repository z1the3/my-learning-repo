# Styled Components

https://styled-components.com/docs/basics#motivation

Styled-components 是 CSS in JS 最热门的一个库了，到目前为止 github 的 star 数已经超过了 35k
通过 styled-components，可以使用 ES6 的标签模板字符串语法（Tagged Templates）为需要 styled 的 Component 定义一系列 CSS 属性

在这个过程中，styled-components 主要做了以下工作：
（1）基于函数传入的样式规则字符串以及动态参数，生成最终样式规则以及唯一性的样式名。将样式规则插入到`<style></style>`中,把对应的 CSS 样式通过 style 标签的形式插入到 head 标签里面
（2）将唯一类名添加到组件的 classname 属性中,动态生成的 CSS 选择器会有一小段哈希值来保证全局唯一性来避免样式发生冲突

从上面的例子可以看出，styled-components 不需要你为需要设置样式的 DOM 节点设置一个样式名，使用完标签模板字符串定义后你会得到一个 styled 好的 Component，直接在 JSX 中使用这个 Component 就可以了
可以看到截图里面框出来的样式生成了一段 hash 值，实现了局部 CSS 作用域的效果（scoping styles），各个组件的样式不会发生冲突

- render 方法外定义 styled-components。

```js
styled.div`是styled('div')`的语法糖。
```

- 从控制台查看，一个 styled-components 组件，都最少会有两个 class。一个 static class 没有任何样式，主要用于定位；一个 dynamic class，基于模版字符串中的 css 以及 props 动态生成。

## 使用动机

**该库仅适用于 react**

- 自动生成关键 css
  *自动*跟踪哪些组件渲染在页面上（运行时），然后向其注入样式
  结合代码分割，只加载关键 css

- 类名命名问题

自动生成独一无二的类名，不用担心重复声明，类名覆盖和错误拼写

- css 删除更容易

传统 css 和 html 割裂，很难知道类名是否被使用

使用 styled-component，类名能显式对应到组件

不必要的可以直接删除

- 简单的动态样式

控制组件 props 和全局主题就能实现样式动态切换

不用手动管理大量类

- 无痛维护成本

不用在多个不同 css 文件之间进行维护

- css 属性自动添加供应商前缀

如 webkit 前缀

- 样式复用

## 使用

```js
// Create a Title component that'll render an <h1> tag with some styles
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

// Use Title and Wrapper like any other React component – except they're styled!
render(
  <Wrapper>
    <Title>Hello World!</Title>
  </Wrapper>
);
```

### 传递 prop

styled-component 封装的 prop 通过`$xxxx`传递

```js
<Input defaultValue="@geelen" type="text" $inputColor="rebeccapurple" />
```

### 最佳实践

样式组件命名 Styled+xxx

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
`;

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
);
```

`&&` 只能拿到其中一个实例

```js
const Input = styled.input.attrs({ type: "checkbox" })``;

const Label = styled.label`
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

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
);
```

---

单独的`&&`,用于防止自定义样式和全局自定义样式冲突

提升自定义样式的优先级

```js
const Thing = styled.div`
  && {
    color: blue;
  }
`;

// 所有div且thing标签
const GlobalStyle = createGlobalStyle`
   div${Thing} {
     color: red;
   }
 `;
```

### .attrs 附带额外 props

这里我们附带了一个`type`静态 props

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

在.attrs 声明组件后再次使用.attrs 能继承再覆盖之前的样式

### 动画

引入 rotate，作为变量用在样式组件的模版字符串中

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

render(<Rotate>&lt; 💅🏾 &gt;</Rotate>);
```
