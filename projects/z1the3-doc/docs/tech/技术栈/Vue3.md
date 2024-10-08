# Vue3

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

## keep-alive

内存占用： 被缓存的组件会一直占用内存，如果页面中包含大量需要缓存的组件，可能会导致内存占用过大。
生命周期问题： 使用 keep-alive 后，组件的生命周期会发生变化，mounted 钩子函数只会在第一次渲染时调用，之后切换时不再调用，而 activated 和 deactivated 钩子函数会被调用。
