## js特性

### 7.自增运算符

```js
// 1
let a = 1
// 2 2
const b = ++a
// 3 2 2
const c = a++
console.log(a)
console.log(b)
console.log(c)

```

### 8.隐式转化 I

```js
console.log(Boolean('false')) // true
console.log(Boolean(false)) // false
console.log('3' + 1) // "31" 字符串类型，打印出来还是数字
console.log('3' - 1) //  2
console.log('3' - ' 02 ') // 1
console.log('3' * ' 02 ') // 6
console.log(Number('1')) // 1
console.log(Number('number')) //NaN
console.log(Number(null)) // 0
console.log(Number(false)) // 0

```

## js实现

### 1.实现柯里化

```js
const join = (a, b, c) => {
   return `${a}_${b}_${c}`
}

const curriedJoin = curry(join)

curriedJoin(1, 2, 3) // '1_2_3'

curriedJoin(1)(2, 3) // '1_2_3'

curriedJoin(1, 2)(3) // '1_2_3'
```

```js
function curry(fn) {
  return function curried(...args) {
    // if number of arguments match
    if (args.length >= fn.length) {
      return fn.call(this, ...args)
    } 
    return function(...missingArgs) {
      return curried.call(this, ...args, ...missingArgs)
    }
  }
}

```

## react

### 8.useDebounce()

```js
function App() {
  const [value, setValue] = useState(...)
  // this value changes frequently, 
  const debouncedValue = useDebounce(value, 1000)
  // now it is debounced
}

```

```js

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay);

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

```

### 9.useEffectOnce()

```js
import { useRef, useEffect, EffectCallback } from 'react'

// 因为依赖数组必须useEffect第一个参数里的包括所有状态，否则会报错，所以用useRef可以解决这个
export function useEffectOnce(effect: EffectCallback) {
  const ref = useRef(effect);
  useEffect(() => ref.current(), []);
}
```

### 15.useClickOutside()

使用的时候给固定的标签绑定导出的ref

```js
function Component() {
  // 定义回调函数
  const ref = useClickOutside(() => {
    alert('clicked outside')
  });
  // 把ref和标签绑定
  return <div ref={ref}>..</div>
}
```

```js
import React, { useRef, useEffect } from 'react'

export function useClickOutside<T extends HTMLElement>(callback: () => void): React.RefObject<T> {
 const ref = useRef<T>(null)

 useEffect(() => {
  const click = ({ target }: Event): void => {
   // ！ref.current.contains(target)，说明点击了外部组件
   if (target && ref.current && !ref.current.contains(target as Node)) {
    callback()
   }
  }

  // 在整个document上绑定
  document.addEventListener('mousedown', click)

  // 记得清除
  return () => {
   document.removeEventListener('mousedown', click)
  }
 }, [])

 return ref
}
```

### 16.useUpdateEffect()

useRef + useEffect

第一次渲染时不执行副作用
Implement useUpdateEffect() that it works the same as useEffect() except that it skips running the callback on first render.

```js

import {EffectCallback, DependencyList} from 'react';

// 来自react的类型
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  // your code here
  const ref = useRef(false);

  useEffect(() => {
    if(!ref.current) {
      ref.current = true;
      return;
    }

    // effect参数的返回结果是清理函数，拿到清理函数
    // 手动调用
    const cleanup = effect();

    return () => {
      cleanup && cleanup();
    }
  }, deps)
}

```
