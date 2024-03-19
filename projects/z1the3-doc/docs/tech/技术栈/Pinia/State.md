# State

Pinia 中，state 被定义为一个返回初始状态的函数

```js
import { defineStore } from "pinia";

const useStore = defineStore("storeId", {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型
      count: 0,
      name: "Eduardo",
      isAdmin: true,
      items: [],
      hasChanged: true,
    };
  },
});
```

如果你愿意，你可以用一个接口定义 state，并添加 state() 的返回值的类型。

```js
interface State {
  userList: UserInfo[]
  user: UserInfo | null
}

const useStore = defineStore('storeId', {
  state: (): State => {
    return {
      userList: [],
      user: null,
    }
  },
})

```

## 访问 state

默认情况下，你可以通过 store 实例访问 state，直接对其进行读写。

```js
const store = useStore();

store.count++;
```

## 变更 state

除了用 store.count++ 直接改变 store，你还可以调用 $patch 方法。它允许你用一个 state 的补丁对象在同一时间更改多个属性：

```js
store.$patch({
  count: store.count + 1,
  age: 120,
  name: "DIO",
});
```

复杂语法可以传入一个函数

```js
store.$patch((state) => {
  state.items.push({ name: "shoes", quantity: 1 });
  state.hasChanged = true;
});
```

## 替换 state

你不能完全替换掉 store 的 state，因为那样会破坏其响应性。但是，你可以 patch 它。

```js
// 这实际上并没有替换`$state`
store.$state = { count: 24 };
// 在它内部调用 `$patch()`：
store.$patch({ count: 24 });
```

你也可以通过变更 pinia 实例的 state 来设置整个应用的初始 state。这常用于 SSR 中的激活过程。

```js
pinia.state.value = {};
```

## 订阅 state

类似于 Vuex 的 subscribe 方法，你可以通过 store 的 $subscribe() 方法侦听 state 及其变化。比起普通的 watch()，使用 $subscribe() 的好处是 subscriptions 在 patch 后只触发一次 (例如，当使用上面的函数版本时)。

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type; // 'direct' | 'patch object' | 'patch function'
  // 和 cartStore.$id 一样
  mutation.storeId; // 'cart'
  // 只有 mutation.type === 'patch object'的情况下才可用
  mutation.payload; // 传递给 cartStore.$patch() 的补丁对象。

  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem("cart", JSON.stringify(state));
});
```

默认情况下，state subscription 会被绑定到添加它们的组件上 (如果 store 在组件的 setup() 里面)。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后依旧保留它们，请将 { detached: true } 作为第二个参数，以将 state subscription 从当前组件中分离

:::tip

```js
watch(
  pinia.state,
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    localStorage.setItem("piniaState", JSON.stringify(state));
  },
  { deep: true }
);
```

:::
