# Vuex

所有数据的变更都需要经过全局的 Store 来进行，形成一个单向数据流，使数据变化变得“可预测”。
store 以一个单例存放，同时利用 Vue.js 的响应式机制来进行高效的状态管理与更新

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/3646592694.png" width="500"/>

Vuex 实现了一个单向数据流，在全局拥有一个 State 存放数据，所有修改 State 的操作必须通过 Mutation 进行，

Mutation 的同时提供了订阅者模式供外部插件调用获取 State 数据的更新。所有异步接口需要走 Action，常见于调用后端接口异步获取更新数据，而 Action 也是无法直接修改 State 的，还是需要通过 Mutation 来修改 State 的数据。最后，根据 State 的变化，渲染到视图上。Vuex 运行依赖 Vue 内部数据双向绑定机制，需要 new 一个 Vue 对象来实现“响应式化”，

所以 Vuex 是一个专门为 Vue.js 设计的状态管理库

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
