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

## ref 和 reactive 的区别

reactive:
(1)它的响应式是更加‘深层次’的，底层本质是将传入的数据包装成一个 Proxy。

(2)参数必须是对象或者数组，如果要让对象的某个元素实现响应式时比较麻烦。需要使用 toRefs

ref:
(1)函数参数可以是基本数据类型，也可以接受对象类型

(2)如果参数是对象类型时，其实底层的本质还是 reactive,系统会自动根据我们给 ref 传入的值转换成：

```js
ref(1)->reactive({value:1})
ref函数只能操作浅层次的数据，把基本数据类型当作自己的属性值；深层次依赖于reactive
```

(3)在 template 中访问，系统会自动添加.value;在 js 中需要手动.value

(4)**ref 响应式原理**是依赖于 Object.defineProperty()的 get()和 set()的。

### ref、toRef、toRefs 的区别

ref:复制，修改响应式数据不影响以前的数据；数据改变，界面自动更新(相当于创建一个新的响应式数据)

toRef:引用，修改响应式数据会影响以前的数据；数据改变，界面不自动更新（相当于只是用来修改）

toRef() 这个函数在你想把一个 prop 的 ref 传递给一个组合式函数时会很有用

prop 是响应式数据的场景不是很多

```html
<script setup>
  import { toRef } from "vue";

  const props = defineProps(/* ... */);

  // 将 `props.foo` 转换为 ref，然后传入
  // 一个组合式函数
  useSomeFeature(toRef(props, "foo"));

  // getter 语法——推荐在 3.3+ 版本使用
  useSomeFeature(toRef(() => props.foo));
</script>
```

toRefs：
(1)接收一个对象作为参数，它会遍历对象身上所有属性，然后调用单个 toRef

(2)将对象的多个属性变成响应式数据，并且要求响应式数据和原始数据关联，且更新响应式数据的时候不会更新界面，用于批量设置多个数据为响应式

---

那么如果我们想给 reactive 对象赋值，且能够被监听到，不丢掉响应性呢。除了一个个.的方式，还可以怎么做？

```js
（1）reactive嵌套一层
  const objList = reactive({
   userInfo:{
    name:"liki",
    age:18,
    sex:'男'
    }
 })
 更新时：objList.userInfo = {...}
 (2)使用ref
 const objList = ref({
    name:"liki",
    age:18,
    sex:'男'
 })
 更新时:
 objList.value = {...}

```

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

## vue 组件通信方式

整理 vue 中 8 种常规的通信方案

-通过 props 传递

-通过 $emit 触发自定义事件
-使用 ref
-EventBus
-$parent 或$root
-attrs 与 listeners
-Provide 与 Inject
-Vuex

### emit

```
this.$emit('add', good)
<Children @add="cartAdd($event)" />
```

### ref

````
<Children ref="foo" />

this.$refs.foo  // 获取子组件实例，通过子组件实例我们就能拿到对应的数据 ```
````

### EventBus

使用场景：兄弟组件传值
创建一个中央事件总线 EventBus
兄弟组件通过$emit触发自定义事件，$emit 第二个参数为传递的数值
另一个兄弟组件通过$on 监听自定义事件

```js
// 创建一个中央时间总线类
class Bus {
  constructor() {
    this.callbacks = {}; // 存放事件的名字
  }
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(fn);
  }
  $emit(name, args) {
    if (this.callbacks[name]) {
      this.callbacks[name].forEach((cb) => cb(args));
    }
  }
}

// main.js
Vue.prototype.$bus = new Bus(); // 将$bus挂载到vue实例的原型上
// 另一种方式
Vue.prototype.$bus = new Vue(); // Vue已经实现了Bus的功能
Children1.vue;

this.$bus.$emit("foo");
Children2.vue;

this.$bus.$on("foo", this.handle);
```

### $parent 或$ root

通过共同祖辈$parent或者$root 搭建通信桥连
兄弟组件

this.$parent.on('add',this.add)

另一个兄弟组件

this.$parent.emit('add')

### $attrs 与$ listeners

适用场景：祖先传递数据给子孙
设置批量向下传属性$attrs 和 $listeners

```
$attrs包含了父级作用域中不作为 prop 被识别 (且获取) 的特性绑定 ( class 和 style 除外)。
可以通过 v-bind="$attrs" 传⼊内部组件


// 给Grandson隔代传值，communication/index.vue
<Child2 msg="lalala" @some-event="onSomeEvent"></Child2>

// Child2做展开
<Grandson v-bind="$attrs" v-on="$listeners"></Grandson>

// Grandson使⽤
<div @click="$emit('some-event', 'msg from grandson')">
{{msg}}
</div>
```

### provide 与 inject

在祖先组件定义 provide 属性，返回传递的值
在后代组件通过 inject 接收组件传递过来的值
祖先组件

```
provide(){
    return {
        foo:'foo'
    }
}
后代组件

inject:['foo'] // 获取到祖先组件传递过来的值
```

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

computed 和 watch

从这个函数名, 就可以看明白 initComputed, 这是初始化计算属性的函数. 它的就是遍历下我们定义的 computed 对象, 然后从中给每一个值定义一个 watcher 实例.

计算属性执行的时候会访问到, this.a 和 this.b. 这时候这两个值因为 Data 初始化的时候就被定义成响应式数据了. 它们内部会有一个 Dep 实例, Dep 实例就会把这个计算 watcher 放到自己的 sub 数组里. 待日后自己更新了, 就去通知数组内的 watcher 实例更新.

```js
const computedWatcherOptions = { lazy: true }

// vm: 组件实例 computed 组件内的 计算属性对象
function initComputed (vm: Component, computed: Object) {
  // 遍历所有的计算属性
  for (const key in computed) {
    // 用户定义的 computed
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    watchers[key] = new Watcher( // 👈 这里
      vm,
      getter || noop,
      noop,
      computedWatcherOptions
    )

  defineComputed(vm, key, userDef) //对计算属性本身做响应式处理
}




```

dirty 的作用.

他就是用来记录我们依赖的值有没有变, 如果变了就重新计算一下值, 如果没变, 那就返回以前的值. 就像一个懒加载的理念. 这也是计算属性缓存的一种方式

一开始 dirty 为 true, 一旦执行了一次计算,就会设置为 false. 然后当它定义的函数内部依赖的值比如: this.a 和 this.b 发声了变化. 这个值就会重新变为 true;

即
下一次执行计算属性时,就会去重新计算,(只在调用时决定是否重新计算，是同步的；而不是在依赖发生变化后，立即变动)

● Computed 属性,watch 和组件一样, 本质上都是一个 watcher 实例.
监听属性 watch 是异步触发的, 为什么这么说呢?

● 实际上监听属性的执行逻辑和组件的渲染是一样的. 它们都会被放到一个 nextTick 函数中, 没错就是我们熟悉的 API.它可以让我们的同步逻辑, 放到下一个 Tick 在执行.

● 计算属性和监听属性对于新值与旧值一样的赋值操作, 都不会做任何变化. 但这点的实现是由响应式系统完成的

计算属性具有"懒计算"功能, 只有依赖的值变化了, 才允许重新计算. 称为"缓存", 个人觉得不准确

在数据更新时, 计算属性的 dirty 状态会立即改变, 而监听属性与组件重新渲染, 至少都会在下一个"tick"执行.

## 响应式原理

vue 双向数据绑定原理?

vue 是通过基于发布订阅模式（观察者）的数据劫持来实现双向数据绑定的

- Observer 观察者函数：监听所有数据的变化，当数据变动时获取最新的值并通知给订阅者（数据劫持）
- Watcher 订阅者函数：当接受到观察者的通知和提供的数据后同步更新视图
- Compile 解析器函数：解析 DOM 元素上的 v-model 指令和 {{}} 语法

  vue.2 是基于 Object.defineProperty，vue.3 是基于 Proxy

### 数据劫持＋观察者模式

1.初始化响应对象--------给 data 中对象的每个 key 创建 dep(放在**ob**里)
observe(this.$data) defineReactive(obj,key,obj[key])

2.编译模板并依赖收集---------对每个组件,生成一个 watcher,如果用到了某个 key,创建 watcher 时会触发该 key 的 getter, 进而将该 watcher 加入到 key 对应对象的 dep 里

Dep.target 挂载当前 watcher

3.以后触发 setter 时,会触发 Dep 上的 notify 使用 watcher 的 update 进而改变视图
执行 this.updaterFn.call()

4.在 update 中, 而在绑定响应式时，会同时将 a.b.c 以字符串形式储存起来作为 expression
该 expression 会在搜索时提供参考，于是就可以在组件的 data 中找到对应的 a.b.c（而且类似组件属性上的 value，跟视图直接绑定），这时修改其值，再触发回调重新渲染

## vue2 与 vue3 的区别

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/6f67a590-5088-11eb-85f6-6fac77c0c9b3.png" width="1200"/>

### 全局 API

createApp()
defineProperty()
defineAsyncComponent()
nextTick()

### 将 vue2 的全局 api 转移到应用对象实例上

app.component
app.config
app.directive
app.mount
app.unmount
app.use

### 三个新组件

fragment(就是 templament)
teleport
suspense(渲染后备内容)

#### fragment

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

framents
在 Vue3.x 中，组件现在支持有多个根节点

### teleport

Teleport 是一种能够将我们的模板移动到 DOM 中 Vue app 之外的其他位置的技术，就有点像哆啦 A 梦的“任意门”

```html
<button @click="showToast" class="btn">打开 toast</button>
<!-- to 属性就是目标位置 -->
<teleport to="#teleport-target">
  <div v-if="visible" class="toast-wrap">
    <div class="toast-msg">我是一个 Toast 文案</div>
  </div>
</teleport>
```

在组件的逻辑位置写模板代码(v-if)，然后在 Vue 应用范围之外渲染它

-setup 生命周期 →setup 语法糖
ref reactive computed watch 生命周期
provide inject
-ref 内部: 通过给 value 属性添加 getter/setter 来实现对数据的劫持
-reactive 内部: 通过使用 Proxy 来实现对对象内部所有数据的劫持, 并通过 Reflect 操作对象内部数据 -如果用 ref 对象/数组, 内部会自动将对象/数组转换为 reactive 的代理对象!!

-watch 函数
与 watch 配置功能一致
监视指定的一个或多个响应式数据, 一旦数据变化, 就自动执行监视回调
默认初始时不执行回调, 但可以通过配置 immediate 为 true, 来指定初始时立即执行第一次
通过配置 deep 为 true, 来指定深度监视

-watchEffect 函数
不用直接指定要监视的数据, 回调函数中使用的哪些响应式数据就监视哪些响应式数据
默认初始时就会执行第一次, 从而可以收集需要监视的数据

-toRefs
把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref
应用: 当从合成函数返回响应式对象时，toRefs 非常有用，这样消费组件就可以在不丢失响应式的情况下对返回的对象进行分解使用
问题: reactive 对象取出的所有属性值都是非响应式的
解决: 利用 toRefs 可以将一个响应式 reactive 对象的所有原始属性转换为响应式的 ref 属性

### treeshaking

体积更小
通过 webpack 的 tree-shaking 功能，可以将无用模块“剪辑”，仅打包需要的

能够 tree-shaking，有两大好处：

对开发人员，能够对 vue 实现更多其他的功能，而不必担忧整体体积过大

对使用者，打包出来的包体积变小了

### compositon Api

可与现有的 Options API 一起使用
灵活的逻辑组合与复用
Vue3 模块可以和其他框架搭配使用

### 更好的 Typescript 支持

VUE3 是基于 typescipt 编写的，可以享受到自动的类型定义提示

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
