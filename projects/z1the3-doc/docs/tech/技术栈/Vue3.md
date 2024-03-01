# Vue3

## 单文件组件

被称为单文件组件 (也被称为 \*.vue 文件，英文 Single-File Components，缩写为 SFC)。

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
