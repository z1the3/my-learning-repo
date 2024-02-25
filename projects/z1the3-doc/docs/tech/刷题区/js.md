# 手撕

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

### 2.带占位符的柯里化

```js
curriedJoin(_, 2)(1, 3) // '1_2_3'
```

```js
function curry(func) {
  return function curried(...args) {
    const complete = args.length >= func.length && !args.slice(0, func.length).includes(curry.placeholder);
    if(complete) return func.call(this, ...args)


    return function(...newArgs) {
      // replace placeholders in args with values from newArgs
      // _,_,_  + _,a -> _,_,_ + a -> a,_,_ 
      const res = args.map(arg => arg === curry.placeholder && newArgs.length ? newArgs.shift() : arg);
      return curried(...res, ...newArgs);
    }
  }
}

curry.placeholder = Symbol()


```

## 补充

### api实现篇

#### 1.发布订阅模式

```js
class EventHub {
  constructor(){
    // 存放event和map，map为对象，每个key为数组
    this.map = {}
  }
  on(event,fn){
    this.map[event] = this.map[event]||[]
   this.map[event].push(fn)
  }
  emit(event,data){
    const fnList = this.map[event] || []
    if (fnList.length === 0) return
    // 遍历该event的缓存列表，依次执行fn
    fnList.forEach(fn => fn.call(undefined,data))
  }
  off(event,fn) {
    const fnList = this.map[event] || []
    const index = fnList.indexOf(fn)
    if(index < 0) return
    fnList.splice(index, 1)
  }
  once(event, callback){
    // data暂时没东西传进去，但是用了 emit就可以被使用
    const f = (data) => {
      callback(data)
      this.off(event, f)
   }
    this.on(event,f)
  }
}

```

### 1.快排

```js
const _quickSort = array => {
    // 补全代码
    myQuickSort(array, 0, array.length - 1)
    return array
}
// 启动函数

// 重点
function myQuickSort(array, l, r) {
    if(l < r) {
        let index = partition(array, l, r) //进行一轮快排
        myQuickSort(array, l, index - 1)
        myQuickSort(array, index + 1, r)
    }
}
function partition(array, l, r) {
    // 随机l-r取值
    let pivot = array[Math.floor(Math.random() * (r - l + 1)) + l]
  // *****这里是双重循环
    while(l < r) {
        while(array[l] < pivot) l++
        while(array[r] > pivot) r--
      // 此时其实都等于pivot
        if(l < r && array[l] == array[r]) l++
        else if(l < r) { //此时array[l]>pivot,array[r]<pivot (=的情况已经排除)
            let t = array[l]
            array[l] = array[r]
            array[r] = t
        }
    }
    //此时l==r
    return l
}

```

### 2.归并

```js
// mergeSort(一个数组）
function mergeSort (nums) {
  if(nums.length < 2) return nums;
  const mid = parseInt(nums.length / 2);
  let left = nums.slice(0,mid);
  let right = nums.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

// merge（数组1，数组2）两个数组
function merge(left, right) {
  let res = [];
  let leftLen = left.length;
  let rightLen = right.length;
  let len = leftLen + rightLen;
  for(let index = 0, i = 0, j = 0; index < len; index ++) {
    if(i >= leftLen){ 
      res[index] = right[j ++];
      continue
    }
    if (j >= rightLen){
      res[index] = left[i ++];
      continue
    } 
    res[index++] = left[i]<=right[j]?left[i++]:right[j++]
    // if (left[i] <= right[j]) res[index] = left[i ++];
    // else {
    //   res[index] = right[j ++];
    //   sum += leftLen - i;//求逆序对时在归并排序中唯一加的一行代码
   // 因为i后面的数肯定都满足大于右边的那一位，能组成逆序对
    // }
  }
  return res;
}
 
var arr = [3,5,7,1,4,56,12,78,25,0,9,8,42,37];
var res = mergeSort(arr);
console.log(arr, res) 

```

### 3. instanceof

```js
  const _instanceof = (target, Fn) => {
      // 判断是不是基础数据类型
      if(target === null || typeof target !== 'object'){
          return false
      }
      let proto = Object.getPrototypeOf(target), // 获取对象的原型
          prototype = Fn.prototype; // 获取构造函数的 prototype 对象
    
      // 判断构造函数的 prototype 对象是否在对象的原型链上
      while (true) {
        if (!proto) return false;
        if (proto === prototype) return true;

        // 重复看proto
        proto = Object.getPrototypeOf(proto);
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
