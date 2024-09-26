# Vue3

## MVVM

分为 model 模型层 view 视图层 viewModel 视图模型层
模型层：负责处理业务逻辑，和服务端交互
视图层：负责将数据模型转化为 UI 展示，可以理解为 html 页面
视图模型层：视图和模型连接的桥梁，通过双向数据绑定连接

View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构成，为了更方便地展现 ViewModel 或者 Model 层的数据。
Model 是指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，主要围绕数据库系统展开。这里的难点主要在于需要和前端约定统一的接口规则。
ViewModel 由前端开发人员组织生成和维护的视图数据层。在这一层，前端开发者从后端获取得到 Model 数据进行转换出来，做二次封装，以生成符合 View 层使用预期的视图数据模型。视图状态和行为都封装在 ViewModel 里。这样的封装使得 ViewModel 可以完整地去描述 View 层。

在 MVVM 架构中，是不允许数据和视图直接通信的，只能通过 ViewModel 来通信，而 ViewModel 就是定义了一个 Observer 观察者。ViewModel 是连接 View 和 Model 的中间件。

ViewModel 能够观察到数据的变化，并对视图对应的内容进行更新。
ViewModel 能够监听到视图的变化，并能够通知数据发生变化。

## 单文件组件

被称为单文件组件 (也被称为 `\*.vue 文件`，英文 Single-File Components，缩写为 SFC)。

顾名思义，Vue 的单文件组件会将一个组件的逻辑 (JavaScript)，模板 (HTML) 和样式 (CSS) 封装在同一个文件里

## 选项式 API

使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 data、methods 和 mounted。选项所定义

的属性都会暴露在函数内部的 this 上，它会指向当前的组件实例。

```html
<script>
  export default {
    // data() 返回的属性将会成为响应式的状态
    // 并且暴露在 `this` 上
    data() {
      return {
        count: 0,
      };
    },

    // methods 是一些用来更改状态与触发更新的函数
    // 它们可以在模板中作为事件处理器绑定
    methods: {
      increment() {
        this.count++;
      },
    },

    // 生命周期钩子会在组件生命周期的各个不同阶段被调用
    // 例如这个函数就会在组件挂载完成后被调用
    mounted() {
      console.log(`The initial count is ${this.count}.`);
    },
  };
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

## 组合式 API

通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与

`<script setup>` 搭配使用。这个 setup attribute 是一个标识，告诉 Vue 需要在编译时进行一些处理，让我

们可以更简洁地使用组合式 API。比如，`<script setup>`中的**导入和顶层变量/函数**都能够**在模板中直接使用**。

```html
<script setup>
  import { ref, onMounted } from "vue";

  // 响应式状态
  const count = ref(0);

  // 用来修改状态、触发更新的函数
  function increment() {
    count.value++;
  }

  // 生命周期钩子
  onMounted(() => {
    console.log(`The initial count is ${count.value}.`);
  });
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

选项式 API 是在组合式 API 的基础上实现的

选项式 API 以“组件实例”的概念为中心 (即上述例子中的 this)，对于有面向对象语言背景的用户来说，这通常与基于类的心智模型更为一致。同时，它将响应性相关的细节抽象出来，并强制按照选项来组织代码，从而对初学者而言更为友好。

组合式 API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。这种形式更加自由，也需要你对 Vue 的响应式系统有更深的理解才能高效使用。相应的，它的灵活性也使得组织和重用逻辑的模式变得更加强大。

在生产项目中：

当你不需要使用构建工具，或者打算主要在低复杂度的场景中使用 Vue，例如渐进增强的应用场景，推荐采用选项式 API。

当你打算用 Vue 构建完整的单页应用，推荐采用组合式 API + 单文件组件

## name 属性的作用

组件中的 name 属性为组件的**声明名称**

```html
<script>
  export default {
    name: main, //组件声明时设置的name属性，即：声明名称
  };
</script>

// 当组件被引入时，设置的名称即是注册名称
<script>
  import Hello from @/...
  export default{
       components:{
            Hello, //此为注册名称
        }
   }
</script>
```

实际工作中，应保证注册名称与声明名称一致

当名称不同时，部分标签的属性可能无法识别组件

如：若未设置声明名称，

keep-alive 的 include 和 exclude 属性将识别注册名称

若同时设置了不同的声明名称和注册名称

此时使用注册名称将无法识别

## 异步组件

```js
import { defineAsyncComponent } from 'vue'


// 异步组件应该返回一个promise
const AsyncComp = defineAsyncComponent(() =>
  return(import('./components/MyComponent.vue'))
)

const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})

```

如果提供了一个加载组件，它将在内部组件加载时先行显示。
在加载组件显示之前有一个默认的 200ms 延迟——这是因为在网络状况较好时，
加载完成得很快，加载组件和最终组件之间的替换太快可能产生闪烁，反而影响用户感受。

如果提供了一个报错组件，则它会在加载器函数返回的 Promise 抛错时被渲染。
你还可以指定一个超时时间，在请求耗时超过指定时间时也会渲染报错组件。

# Vue 八股

## diff

只比较两个节点的一层子节点，就是同层比较的意思
在比较单一节点时如果 key 值不同，直接替换为新节点
diff 算法最重要的内容是比较在 key 相同且两个节点都有子节点时子节点的差异

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/WeChatcc0c95b6a623b388bc8efc28742b14d1.jpg" width="1200"/>

vue2 使用双端头尾比较

vue3 使用最长递增序列 + 静态标记

## keep-alive

内存占用： 被缓存的组件会一直占用内存，如果页面中包含大量需要缓存的组件，可能会导致内存占用过大。
生命周期问题： 使用 keep-alive 后，组件的生命周期会发生变化，mounted 钩子函数只会在第一次渲染时调用，之后切换时不再调用，而 activated 和 deactivated 钩子函数会被调用。

## vue2 覆盖数组方法

### 1. Object.defineProperty 的缺点

- 不能监听数组：因为数组没有 getter 和 setter，因为数组长度不确定，如果太长性能负担太大
- 只能监听属性，而不是整个对象，需要遍历循环属性（暴力递归
- 只能监听属性变化，不能监听属性的删减

### 2. proxy 的好处

- 可以监听数组
- 监听整个对象不是属性
- 13 种拦截方法，强大很多
- 返回新对象而不是直接修改原对象，更符合 immutable；

### 3. proxy 的缺点

- 兼容性不好，而且无法用 polyfill 磨平

Vue 无法检测 property 的添加或移除
由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化

push,
pop,
shift,
unshift,
splice,
sort,
reverse

### 对于返回新数组

filter
concat
slice
