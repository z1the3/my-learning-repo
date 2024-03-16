# Vuex

状态存储是响应式的

五个核心概念：state、getters、actions、mutations、modules

所有数据的变更都需要经过全局的 Store 来进行，形成一个单向数据流，使数据变化变得“可预测”。
store 以一个单例存放，同时利用 Vue.js 的响应式机制来进行高效的状态管理与更新

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/3646592694.png" width="500"/>

Vuex 实现了一个单向数据流，在全局拥有一个 State 存放数据，所有修改 State 的操作必须通过 Mutation 进行，

Mutation 的同时提供了订阅者模式供外部插件调用获取 State 数据的更新。所有异步接口需要走 Action，常见于调用后端接口异步获取更新数据，而 Action 也是无法直接修改 State 的，还是需要通过 Mutation 来修改 State 的数据。最后，根据 State 的变化，渲染到视图上。Vuex 运行依赖 Vue 内部数据双向绑定机制，需要 new 一个 Vue 对象来实现“响应式化”，

所以 Vuex 是一个专门为 Vue.js 设计的状态管理库

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
