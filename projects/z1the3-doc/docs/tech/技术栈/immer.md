
# immerjs

## 文档
<https://immerjs.github.io/immer/>

## 仓库
<https://github.com/immerjs/immer?tab=readme-ov-file>

## 介绍

## Immutable问题

Immer 想解决的问题，是利用元编程简化 Immutable 使用的复杂度。举个例子，我们写一个纯函数

```js
const addProducts = products => {
  const cloneProducts = products.slice()
  cloneProducts.push({ text: "shoes" })
  return cloneProducts
}

```

如果 js 原生支持 Immutable，就可以直接使用 push 了！对，Immer 让 js 现在就支持

```js
const addProducts = produce(products => {
  products.push({ text: "shoes" })
})

```

这两个 addProducts 函数功能一模一样，而且都是纯函数。

react 框架中，setState 支持函数式写法：

```js
this.setState(state => {
  const cloneProducts = state.products.slice()
  cloneProducts.push({ text: "shoes" })
  return {
    ...state,
    cloneProducts
  }
})

```

然而有了 Immer，一切都不一样了：

```js
this.setState(produce(state => (state.isShow = true)))

this.setState(produce(state => state.products.push({ text: "shoes" })))
```

方便的柯里化
上面讲述了 Immer 支持柯里化带来的好处。所以我们也可以直接把两个参数一次性消费：

```js
const nextState = baseState.slice() // shallow clone the array
nextState[1] = {
    // replace element 1...
    ...nextState[1], // with a shallow clone of element 1
    done: true // ...combined with the desired update
}
// since nextState was freshly cloned, using push is safe here,
// but doing the same thing at any arbitrary time in the future would
// violate the immutability principles and introduce a bug!
nextState.push({title: "Tweet about it"})

```

```js
import {produce} from "immer"

const nextState = produce(baseState, draft => {
    draft[1].done = true
    draft.push({title: "Tweet about it"})
})

```

这就是 Immer：Create the next immutable state by mutating the current one.

```js
produce: IProduce = (base: any, recipe?: any, patchListener?: any) => {

```

`produce` function takes a value and a "recipe function" (whose
  return value often depends on the base state). The recipe function is
  free to mutate its first argument however it wants. All mutations are
  only ever applied to a __copy__ of the base state.

  **Pass only a function** to create a "curried producer" which relieves you from passing the recipe function every time.

   ```js
   // curried invocation
  if (typeof base === "function" && typeof recipe !== "function") {
   const defaultBase = recipe
   recipe = base

        // 保留了最初的this
   const self = this
   return function curriedProduce(
    this: any,
    base = defaultBase,
    ...args: any[]
   ) {
    return self.produce(base, (draft: Drafted) => recipe.call(this, draft, ...args)) // prettier-ignore
   }
  }


    const cp = produce((draft)=>{
      draft.x = 1
    },{x:2})

    cp()

   
   ```
  
  Only plain objects and arrays are made mutable. All other objects are
  considered uncopyable.
 
## 源码(早期版本)

我们看 produce 函数 callback 部分：

```js
produce(obj, draft => {
  draft.count++
})
```

obj 是个普通对象，那黑魔法一定出现在 draft 对象上，Immer 给 draft 对象的所有属性做了监听。

所以整体思路就有了：draft 是 obj 的代理，对 draft mutable 的修改都会流入到自定义 setter 函数，它并不修改原始对象的值，而是递归父级不断浅拷贝，最终返回新的顶层对象，作为 produce 函数的返回值。

## 生成代理

第一步，也就是将 obj 转为 draft 这一步，为了提高 Immutable 运行效率，我们需要一些额外信息，因此将 obj 封装成一个包含额外信息的代理对象：

```js
{
  modified, // 是否被修改过
  finalized, // 是否已经完成（所有 setter 执行完，并且已经生成了 copy）
  parent, // 父级对象
  base, // 原始对象（也就是 obj）
  copy, // base（也就是 obj）的浅拷贝，使用 Object.assign(Object.create(null), obj) 实现
  proxies, // 存储每个 propertyKey 的代理对象，采用懒初始化策略
}

```

在这个代理对象上，绑定了自定义的 getter setter，然后直接将其扔给 produce 执行。

### getter

produce 回调函数中包含了用户的 mutable 代码。所以现在入口变成了 getter 与 setter。

getter 主要用来__懒初始化__代理对象，也就是当代理对象子属性被访问的时候，才会生成其代理对象。

```js
{
  a: {},
  b: {},
  c: {}
}

```

那么初始情况下，draft 是 obj 的代理，所以访问 draft.a draft.b draft.c 时，都能触发 getter setter，进入自定义处理逻辑。可是对 draft.a.x 就无法监听了，因为代理只能监听一层。

代理懒初始化就是要解决这个问题，当访问到 draft.a 时，自定义 getter 已经悄悄生成了新的针对 draft.a 对象的代理 draftA，因此 draft.a.x 相当于访问了 draftA.x，所以能递归监听一个对象的所有属性。

同时，如果代码中只访问了 draft.a，那么只会在内存生成 draftA 代理，b c 属性因为没有访问，因此不需要浪费资源生成代理 draftB draftC。

当然 Immer 做了一些性能优化，以及在对象__被修改过__（modified）获取其 copy 对象，为了保证 base 是不可变的, 这里不做展开。

```js
 get(state, prop) {
    // 如果已经被修改过，则从draft对象取，因为可能是基于draft对象自增
    // 此时懒初始化，并替换draft对象原来的raw
    if (this.modified) {
        const value = this.copy[prop]
        if (!isProxy(value) && isProxyable(value))
            return (this.copy[prop] = createProxy(this, value))
        return value
    } else {
        if (prop in this.draft) return this.draft[prop]
        const value = this.base[prop]
        if (!isProxy(value) && isProxyable(value))
            return (this.draft[prop] = createProxy(this, value))
        return value
    }
  }

```

## setter

当对 draft 修改时，会对 base 也就是原始值进行浅拷贝，保存到 copy 属性，同时将 modified 属性设置为 true。这样就完成了最重要的 Immutable 过程，而且浅拷贝并不是很消耗性能，加上是按需浅拷贝，因此 Immer 的性能还可以。

同时为了保证整条链路的对象都是新对象，会根据 parent 属性递归父级，不断浅拷贝，直到这个叶子结点到根结点整条链路对象都换新为止。

完成了 modified 对象再有属性被修改时，会将这个新值保存在 copy 对象上。

```js
        set(prop, value) {
            if (!this.modified) {
                if (
                  // 改动后值不变， 直接返回
                    (prop in this.base && this.base[prop] === value) ||
                    (prop in this.draft && this.draft[prop] === value)
                )
                    return
                this.markChanged()
            }
            this.copy[prop] = value
        }
        // 否则标记已经被修改过，浅拷贝一次已经proxy化的对象
        // 因为以后不用再proxy化，所以modified改为true，能节约这一操作
        // 为什么要单独划出this.draft? 看下一个标题
        markChanged() {
            if (!this.modified) {
                this.modified = true
                this.copy = Array.isArray(this.base) // TODO: eliminate those isArray checks?
                    ? this.base.slice()
                    : Object.assign({}, this.base)
                Object.assign(this.copy, this.draft) // yup that works for arrays as well
            }
        }
```

## 生成 Immutable 对象

当执行完 produce 后，用户的所有修改已经完成（所以 Immer 没有支持异步），如果 modified 属性为 false，说明用户根本没有改这个对象，那直接返回原始 base 属性即可。

如果 modified 属性为 true，说明对象发生了修改，返回 copy 属性即可。但是 setter 过程是递归的，draft 的子对象也是 draft（包含了 base copy modified 等额外属性的代理），我们必须一层层递归，拿到真正的值。

所以在这个阶段，所有 draft 的 finalized 都是 false，copy 内部可能还存在大量 draft 属性，因此递归 base 与 copy 的子属性，如果相同，就直接返回；如果不同，递归一次整个过程（从这小节第一行开始）。

最后返回的对象是由 base 的一些属性（没有修改的部分）和 copy 的一些属性（修改的部分）最终拼接而成的。最后使用 freeze 冻结 copy 属性，将 finalized 属性设置为 true。

至此，返回值生成完毕，我们将最终值保存在 copy 属性上，并将其冻结，返回了 Immutable 的值。

Immer 因此完成了不可思议的操作：Create the next immutable state by mutating the current one。

```js
    // given a base object, returns it if unmodified, or return the changed cloned if modified
    function finalize(base) {
        if (isProxy(base)) {
            const state = base[PROXY_STATE]
            if (state.modified === true) {
                if (isPlainObject(base)) return finalizeObject(state)
                if (Array.isArray(base)) return finalizeArray(state)
                if (isPlainObject(state.base)) return finalizeObject(state)
                if (Array.isArray(state.base)) return finalizeArray(state)
            } else return state.base
        }
        return base
    }

    // 以object为例

        function finalizeObject(state) {
        const copy = state.copy
        Object.keys(copy).forEach(prop => {
            copy[prop] = finalize(copy[prop]) // TODO: make sure no new proxies are generated!
        })
        return freeze(copy)
    }

```

> 源码读到这里，发现 Immer 其实可以支持异步，只要支持 produce 函数返回 Promise 即可。最大的问题是，最后对代理的 revoke 清洗，需要借助全局变量，这一点阻碍了 Immer 对异步的支持。

4 总结

## 引用
<https://github.com/ascoders/weekly/blob/master/%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/48.%E7%B2%BE%E8%AF%BB%E3%80%8AImmer.js%E3%80%8B%E6%BA%90%E7%A0%81.md>
