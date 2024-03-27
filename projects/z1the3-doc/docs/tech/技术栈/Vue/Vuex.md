# Vuex

https://vuex.vuejs.org/zh/

状态存储是响应式的

五个核心概念：state、getters、actions、mutations、modules

所有数据的变更都需要经过全局的 Store 来进行，形成一个单向数据流，使数据变化变得“可预测”。
store 以一个单例存放，同时利用 Vue.js 的响应式机制来进行高效的状态管理与更新

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/3646592694.png" width="500"/>

Vuex 实现了一个单向数据流，在全局拥有一个 State 存放数据，所有修改 State 的操作必须通过 Mutation 进行，

Mutation 的同时提供了订阅者模式供外部插件调用获取 State 数据的更新。所有异步接口需要走 Action，常见于调用后端接口异步获取更新数据，而 Action 也是无法直接修改 State 的，还是需要通过 Mutation 来修改 State 的数据。最后，根据 State 的变化，渲染到视图上。Vuex 运行依赖 Vue 内部数据双向绑定机制，需要 new 一个 Vue 对象来实现“响应式化”，

所以 Vuex 是一个专门为 Vue.js 设计的状态管理库

## mutation

更改 Vuex 的 **store 中的状态的唯一方法是提交 mutation**。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type)和一个回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数

```js
const store = createStore({
  state: {
    count: 1,
  },
  mutations: {
    // increment就是type
    increment(state) {
      // 变更状态, 直接访问state
      state.count++;
    },
  },
});
```

你不能直接调用一个 mutation 处理函数。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation 处理函数，你需要以相应的 type 调用 store.commit 方法

```js
store.commit("increment");
```

## action

```js
const store = createStore({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },

  Action 类似于 mutation，不同在于：

Action 提交的是 mutation，而不是直接变更状态。
Action 可以包含任意异步操作。
让我们来注册一个简单的 action：
  actions: {
    increment(context) {
      context.commit("increment");
    },
  },
});
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。当我们在之后介绍到 Modules 时，你就知道 context 对象为什么不是 store 实例本身了。

实践中，我们会经常用到 ES2015 的参数解构来简化代码（特别是我们需要调用 commit 很多次的时候）：

```js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

使用 action

```js
actions: {
  a ({ commit }) {
    commit('increment')
  }
}

store.dispatch('a')
```

乍一眼看上去感觉多此一举，我们直接分发 mutation 岂不更方便？实际上并非如此，还记得 mutation 必须同步执行这个限制么？Action 就不受约束！我们可以在 action 内部执行异步操作：

```js
actions: {
  a ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

### 组合 Action

Action 通常是异步的，那么如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？

首先，你需要明白 store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 store.dispatch 仍旧返回 Promise：

```js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

```js
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

## mapState 辅助函数

当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性，让你少按几次键。

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from "vuex";

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: (state) => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: "count",

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState(state) {
      return state.count + this.localCount;
    },
  }),
};
```

## mapGetters 辅助函数

```js
import { mapGetters } from "vuex";

export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      "doneTodosCount",
      "anotherGetter",
      // ...
    ]),
  },
};

mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: "doneTodosCount",
});
```

## mapMutations 辅助函数

```js
import { mapMutations } from "vuex";
export default {
  //..
  methods: {
    ...mapMutations([
      "increment", // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: "increment", // 映射 this.add() 为 this.$store.commit('increment')
    }),
  },
};
```

## Module

使用单一状态树，导致应用的所有状态集中到一个很大的对象。但是，当应用变得很大时，store 对象会变得臃肿不堪。
为了解决以上问题，Vuex 允许我们将 store 分割到模块（module）。每个模块拥有自己的 state、mutation、action、getters、甚至是嵌套子模块——从上至下进行类似的分割：

```js
import Vuex from "vuex";
import topNav_store from "./topNav/store.js";
import member_store from "./member/store.js";
import game_store from "./coupon/game.js";
import approval from "./approval/store.js";
import setRentInfo from "./contract/store.js";
export default new Vuex.Store({
  modules: {
    topNav: topNav_store,
    memberStore: member_store,
    game_store: game_store,
    approval: approval,
    setRentInfo,
  },
});
```

## Vuex 是怎样把 store 注入到 Vue 实例中去的呢？

Vue.js 提供了 Vue.use 方法用来给 Vue.js 安装插件，内部通过调用插件的 install 方法(当插件是一个对象的时候)来进行插件的安装。

对于 Vue2.0，则会将 vuexinit 混淆进 Vue 的 beforeCreacte 钩子中。

Vuex 采用了 new 一个 Vue 对象来实现数据的“响应式化”，

运用 Vue.js 内部提供的数据双向绑定功能来实现 store 的数据与视图的同步更新。

```js
/* 通过vm重设store，新建Vue对象使用Vue内部的响应式实现注册state以及computed */
function resetStoreVM (store, state, hot) {
  /* 存放之前的vm对象 */
  const oldVm = store._vm

  // bind store public getters
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}

  /* 通过Object.defineProperty为每一个getter方法设置get方法，比如获取this.$store.getters.test的时候获取的是store._vm.test，也就是Vue对象的computed属性 */
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  /* Vue.config.silent暂时设置为true的目的是在new一个Vue实例的过程中不会报出一切警告 */
  Vue.config.silent = true
  /*  这里new了一个Vue对象，运用Vue内部的响应式实现注册state以及computed*/
  store._vm = new Vue({
    data: {
      ?state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  /* 使能严格模式，保证修改store只能通过mutation */
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    /* 解除旧vm的state的引用，以及销毁旧的Vue对象 */
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.?state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}

```

resetStoreVM 首先会遍历 wrappedGetters，使用 Object.defineProperty 方法为每一个 getter 绑定上 get 方法，这样我们就可以在组件里访问 this.$store.getter.test 就等同于访问 store.\_vm.test。

进而操作 store 也能操作原响应式数据，不丢失响应式数据

相当于一道桥梁

> 引用 https://juejin.cn/post/7002051814153519118#heading-0
