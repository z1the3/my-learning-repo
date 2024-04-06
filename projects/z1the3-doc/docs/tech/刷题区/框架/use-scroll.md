# useScroll

虽然 React 组件基本上不需要关心太多的浏览器 API，但是有时候却是必须的：界面需要根据在窗口大小变化重新布局；在页面滚动时，需要根据滚动条位置，来决定是否显示一个“返回顶部”的按钮。

```js
import { useState, useEffect } from "react";

// 获取横向，纵向滚动条位置
const getPosition = () => {
  return {
    x: document.body.scrollLeft,
    y: document.body.scrollTop,
  };
};
const useScroll = () => {
  // 定一个 position 这个 state 保存滚动条位置
  const [position, setPosition] = useState(getPosition());
  useEffect(() => {
    const handler = () => {
      setPosition(getPosition());
    };
    // 监听 scroll 事件，更新滚动条位置
    document.addEventListener("scroll", handler);
    return () => {
      // 组件销毁时，取消事件监听
      document.removeEventListener("scroll", handler);
    };

    // 渲染时挂载
  }, []);
  return position;
};
```

另一种利用 window.scroll

```js
function useScrollPostion() {
  const [scrollX, setScrollX] = useState(0);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollX(window.scrollX);
      setScrollY(window.scrollY);
    }
    window.addEventListner("scroll", handleScroll);

    // ----------------
    return () => {
      window.removeEventListner("scroll", handleScroll);
    };
    // ----------------
  }, []);

  return [scrollX, scrollY];
}
```

有了这个 Hook，你就可以非常方便地监听当前浏览器窗口的滚动条位置了，比如 返回顶部 功能的实现

```js
import React, { useCallback } from "react";
import useScroll from "./useScroll";

function ScrollTop() {
  const { y } = useScroll();

  const goTop = useCallback(() => {
    document.body.scrollTop = 0;
  }, []);

  const style = {
    position: "fixed",
    right: "10px",
    bottom: "10px",
  };
  // 当滚动条位置纵向超过 300 时，显示返回顶部按钮
  if (y > 300) {
    return (
      <button onClick={goTop} style={style}>
        Back to Top
      </button>
    );
  }
}
```

类组件实现（HOC 分解逻辑）

```js
const withWindowSize = Component => {
  // 产生一个高阶组件 WrappedComponent，只包含监听窗口大小的逻辑
  class WrappedComponent extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        size: this.getSize()
      };
    }
    componentDidMount() {
      window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
    }
    getSize() {
      return window.innerWidth > 1000 ? "large" ："small";
    }
    handleResize = ()=> {
      const currentSize = this.getSize();
      this.setState({
        size: this.getSize()
      });
    }
    render() {
      // 将窗口大小传递给真正的业务逻辑组件
      return <Component size={this.state.size} />;
    }
  }
  return WrappedComponent;
};

// 业务逻辑组件可以拿到屏幕size，然后做逻辑判断
class MyComponent extends React.Component{
  render() {
    const { size } = this.props;
    if (size === "small") return <SmallComponent />;
    else return <LargeComponent />;
  }
}
// 使用 withWindowSize 产生高阶组件，用于产生 size 属性传递给真正的业务组件
export default withWindowSize(MyComponent);
```
