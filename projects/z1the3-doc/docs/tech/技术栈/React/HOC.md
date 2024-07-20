# HOC

higherOrderComponent

HOC 并不是 React API，是一种设计模式，类似**装饰器**。具体而言，HOC 是一个函数，他接受一个组件，返回一个新组件。

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

被包裹的组件不会感知到高阶组件的存在，高阶组件会返回一个增强原有组件的组件。

## 实现方式

HOC 有两种实现方式，一种是属性代理（Props Proxy）的形式，通过包裹 WrappedComponent，同时传入 this.props。这个时候其实可以做很多事情

```js
const Enhance = (WrappedComponent) =>
  class extends Component {
    // 操作 state，在 HOC 内，组装 state，传入 WrappedComponent
    constructor() {
      this.state = { data: null };
    }
    componentDidMount() {
      this.setState({ data: "Hello" });
    }
    render() {
      // 操作 props，截取原有的 props，进行增删改，不过需要谨慎操作，避免覆盖或者破坏原有的 props 的结构
      return <WrappedComponent {...this.props} data={this.state.data} />;
    }
  };
```

用其他 element 包装 WrappedComponent，通常用于封装样式、调整布局或者其他目的

```js
const higherOrderComponent = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <div>
          // Do whatever you want to do
          <span>some tips</span>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
};
```

当然也可以通过 refs 引用组件实例

https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e

## 反向继承（Inheritance Inversion）

第二种实现方式是 反向继承（Inheritance Inversion），

通过反向继承，能通过 super 拿到被包裹组件的关键方法，然后再包裹增强的方法

因为是继承 WrappedComponent，所以我们可以取到所有的生命周期方法，state 和其他 function。在真正渲染的时候时候是调用 super.render()，实际上这个时候可以实现渲染劫持（不渲染）。

举一个简单的例子，权限认证：

```js
export default function Authorized(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      if (!auth.isAuthenticated()) {
        return <Login />;
      }
      const elements = super.render();
      return elements;
    }
  };
}
```

完全可以通过劫持 super.render()，做你想做的任何事情，比如外层包个 div，加个 style。

这种方式同时体现了 AOP 面向切面编程思想，关注点分离，可以将功能代码（权限管理、日志、持久化）从主业务逻辑代码中分离出来。也适用于在软件开发后期去增强和扩展现有组件的功能。

HOC 的耦合性很低，灵活性较高，可以非常方便的自由组合，适合于处理复杂的业务。

这里的 Authorized 有一种非常简单的使用方式。

```js
@Authorized
class PageComponent extends React.Component {
  // ...
}
```

就是装饰器，这个地方你可能有点熟悉感了，React-router 中的 withRouter 也是这么使用的，实际上，withRouter 内部是使用 HOC 中的属性代理（Props Proxy）方式实现的，同样的还有 connect：

```js
connect(mapStateToProps， mapDispatchToProps)(Component)
```

不过 connect 的实现会更高级一点，他是一个**高阶函数**，一个返回高阶组件的**高阶函数**

## Compound Components 复合组件

复合组件包含一组组件的状态和行为，但是同时将渲染的细节部分暴露给外部用户。

举个简单例子，正常实现 Tabs 组件

内部实现有一个弊端，结构太固定了，不方便扩展，比如

我想将 tabs 选项卡放在下面，panels 面板放在上面，就必须得修改源码，传入一个属性，然后在 render 中根据属性进行调整
在某个 panel 面板上显示一条红色的提示信息
在某个 tab 的右上角上添加小圆圈组件，显示未读消息条数 （你怎么改）

需求是多变的，所以 Tabs 组件除了封装状态和选项卡切换、高亮等交互行为以外，还要将个性化的渲染需求暴露给用户

```js
<Tabs value={this.state.value} selectTabIndex={this.selectTabIndex}>
  <div className="right">
    <TabsList>
      <Tab index={0}>
        Tab A <Notification>5</Notification>
      </Tab>
      <Tab index={1}>Tab B</Tab>
    </TabsList>
  </div>
  <TabsPanels>
    <Panel index={0}>This is Tab A</Panel>
    <Panel index={1}>
      <div className="redText">Some tips for Tab B</div>
      This is Tab B
    </Panel>
  </TabsPanels>
</Tabs>
```

可以自由控制 tabs 和 panels 的位置，也可以针对 tab 和 panel 实现各种自定义渲染，对应的实现：

### 利用 context 实现

```js
import React from 'react';
​
// 储存了一个context，这样后代组件都能共享状态
const TabsContext = React.createContext();
​
const Tab = ({ index, children }) => (
  <TabsContext.Consumer>
    {context => (
      <div
        className={context.activeIndex === index ? 'activeTab' : 'tab'}
        onClick={event => context.selectTabIndex(index, event)}
      >
        {children}
      </div>
    )}
  </TabsContext.Consumer>
);
const TabsList = ({ children }) => <div className="tabslist">{children}</div>;
​
const Panel = ({ index, children }) => (
  <TabsContext.Consumer>
    {context => (
      // context上可能有需要内容
      <div className={context.activeIndex === index ? 'activePanel' : 'panel'}>
        {children}
      </div>
    )}
  </TabsContext.Consumer>
);
const TabsPanels = ({ children }) => (
  <TabsContext.Consumer>

    {
      // 这个context是consumer传入的
      context => <div className="tabspanels">{children}</div>}
  </TabsContext.Consumer>
);
​
class Tabs extends React.Component {
  render() {
    const initialValue = {
      activeIndex: this.props.value,
      selectTabIndex: this.props.selectTabIndex
    };
    return (
      <TabsContext.Provider value={initialValue}>
        {this.props.children}
      </TabsContext.Provider>
    );
  }
}


```

复合组件包含一组状态和行为，但是仍然可将其可变部分的渲染控制转交给外部用户控制。

### 利用 render props 实现

#### 将对象直接作为 children 传入

当父组件的有些信息没有必要通过 props 传递给子组件,
适用于父组件已经拥有子组件会用到的所有数据

```js
function UserName({ children }) {
  return (
    <div>
      <b>{ children.lastName }</b>,
      { children.firstName }
    </div>
  );
}
​
function App() {
  const user = {
    firstName: 'Krasimir',
    lastName: 'Tsonev'
  };
  return (
    <UserName>{ user }</UserName>
  );
}
```

#### 依赖倒置，将函数作为 children 传入

注意观察 App 组件是如何不暴露数据结构的，TodoList 完全不知道 label 和 status 属性的存在。

```js
function TodoList({ todos, children }) {
  return (
    <section className='main-section'>
      <ul className='todo-list'>{
        todos.map((todo, i) => (
          <li key={ i }>{ children(todo) }</li>
        ))
      }</ul>
    </section>
  );
}
​
function App() {
  const todos = [
    { label: 'Write tests', status: 'done' },
    { label: 'Sent report', status: 'progress' },
    { label: 'Answer emails', status: 'done' }
  ];
  const isCompleted = todo => todo.status === 'done';
  return (
    <TodoList todos={ todos }>
      {
        todo => isCompleted(todo) ?
          <b>{ todo.label }</b> : todo.label
      }
    </TodoList>
  );
}
```

#### render props

有点像 children 传入，但是这里换成占用 render 字段

```js
function TodoList({ todos, render }) {
  return (
    <section className='main-section'>
      <ul className='todo-list'>{
        todos.map((todo, i) => (
          <li key={ i }>{ render(todo) }</li>
        ))
      }</ul>
    </section>
  );
}
​
return (
  <TodoList
    todos={ todos }
    render={
      todo => isCompleted(todo) ?
        <b>{ todo.label }</b> : todo.label
    } />
);
```

#### render props

```js
class DataProvider extends React.Component {
  constructor(props) {
    super(props);
​
    this.state = { data: null };
    setTimeout(() => this.setState({ data: 'Hey there!' }), 5000);
  }
  render() {
    if (this.state.data === null) return null;
    return (
      <section>{ this.props.render(this.state.data) }</section>
    );
  }
}
```

DataProvider 在首次挂载时不渲染任何内容。5 秒后我们更新了组件的状态，并渲染出一个 `<section>`，`<section>` 的内容是由 render 属性提供的。可以想象一下这种类型的组件，可以从远程服务器获取数据，并且决定什么时候渲染。

```js
<DataProvider render={(data) => <p>The data is here!</p>} />
```

描述我们想要做的事，而不是如何去做

#### 依赖倒置

这种声明式的方式相当优雅，不言自明。Authorize 会进行认证，检查当前用户是否具有权限。如果用户具有读取产品列表的权限，那么我们便渲染 ProductList 。（大家可以比对一下 render prop 和 HOC 实现 Authorize 的差异，其实都是 AOP 编程思想的体现）
