# forwardRef

React.forwardRef 会创建一个 React 组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。这种技术并不常见，但在以下两种场景中特别有用：

一、转发 refs 到 DOM 组件
二、在高阶组件中转发 refs

默认情况下，每个组件的 DOM 节点都是私有的。然而，有时候将 DOM 节点公开给父组件是很有用的，比如允许对它进行聚焦。将组件定义包装在 forwardRef() 中便可以公开 DOM 节点：

```js
import { forwardRef } from "react";

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      // 把dom标签上的ref暴露出去
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

这样，父级的 Form 组件就**能够访问** MyInput 暴露的 `<input>` DOM 节点：

```js
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        编辑
      </button>
    </form>
  );
}
```
