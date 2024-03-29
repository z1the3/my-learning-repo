# 手撕

## js 特性

### 7.自增运算符

```js
// 1
let a = 1;
// 2 2
const b = ++a;
// 3 2 2
const c = a++;
console.log(a);
console.log(b);
console.log(c);
```

### 8.隐式转化 I

```js
console.log(Boolean("false")); // true
console.log(Boolean(false)); // false
console.log("3" + 1); // "31" 字符串类型，打印出来还是数字
console.log("3" - 1); //  2
console.log("3" - " 02 "); // 1
console.log("3" * " 02 "); // 6
console.log(Number("1")); // 1
console.log(Number("number")); //NaN
console.log(Number(null)); // 0
console.log(Number(false)); // 0
```

## js 实现

### 2.带占位符的柯里化

```js
curriedJoin(_, 2)(1, 3); // '1_2_3'
```

```js
function curry(func) {
  return function curried(...args) {
    const complete =
      args.length >= func.length &&
      !args.slice(0, func.length).includes(curry.placeholder);
    if (complete) return func.call(this, ...args);

    return function (...newArgs) {
      // replace placeholders in args with values from newArgs
      // _,_,_  + _,a -> _,_,_ + a -> a,_,_
      const res = args.map((arg) =>
        arg === curry.placeholder && newArgs.length ? newArgs.shift() : arg
      );
      return curried(...res, ...newArgs);
    };
  };
}

curry.placeholder = Symbol();
```

## 补充

#### 3.实现箭头函数

babel 就是这样转译的

es6->es5

```js
// ES6
const obj = {
  getArrow() {
    return () => {
      console.log(this === obj);
    };
  },
};
```

```js
// ES5，由 Babel 转译
var obj = {
  getArrow: function getArrow() {
    // 继承上一层作用域的this
    // 如果！getArrow在使用时，作用域被推到window上，因此上一层作用域是window
    var _this = this;
    return function () {
      console.log(_this === obj);
    };
  },
};
```

注意是

```js
() => {
      console.log(this === obj);
    };
----
var _this = this;
function () {
  console.log(_this === obj);
};

```

#### 4.实现私有属性

```js
class E {
  constructor() {
    this.map = new Map();
    this.map.set(this, { a: 1 });
  }
  getA() {
    return this.map.get(this)["a"];
  }
}

let e = new E();
console.log(e.getA());

var Person = (function () {
  var privateData = new WeakMap();

  function Person(name) {
    privateData.set(this, { name: name });
  }

  Person.prototype.getName = function () {
    return privateData.get(this).name;
  };

  return Person;
})();
```

用 this 做 map 上的 Key

这样在外界无法**直接**找到 map 上存有数据的那个键

利用 map 的键可以是对象

#### 5.洋葱模型中间件+compose

```js
// function middleWare({ getState, dispatch }) {
//     return next => action => {
//         ...
//         next(action);
//     }
// }
const middlewareAPI = {
  getState: store.getState,
  dispatch: (action, ...args) => dispatch(action, ...args),
};
// 向chain中每个高阶函数注入API
const chain = middlewares.map((middleware) => middleware(middlewareAPI));

// 接下来执行的是compose聚合函数，把chain中的中间件聚合成一个新的dispatch函数：
//第一个中间件是store.dispatch
const dispatch = compose(...chain)(store.dispatch);

return { ...store, dispatch };
```

```js
function compose(...functions) {
  if (functions.length === 0) {
    return (...args) => args;
  } else if (functions.length === 1) {
    return functions[0];
  } else {
    return functions.reduce(
      (pre, current) =>
        (...args) =>
          pre(current(args))
    );
    // [a,b,c]
    // (...args)=>a(b(args))
    // (...args)=>a(b(c))
  }
}
```

### 6.实现 new

！！！prototype 不允许直接修改
不可直接被外界访问和修改

```js
const _new = function (constructor, ...args) {
  // new关键字做了4件事
  // 1. 创建一个新对象
  const obj = {};
  // 2. 为新对象添加属性__proto__，将该属性链接至构造函数的原型对象
  obj.__proto__ = Object.create(constructor.prototype);
  // 3. 执行构造函数，this被绑定在新对象上
  const res = constructor.apply(obj, args);
  // 4. 确保返回一个对象
  return res instanceof Object ? res : obj;
};
```

### 7.Function.prototype.call/apply

```js
Function.prototype._call = function (target = window) {
  // fn可以随便起个名字，只要最后删除就行
  // 注意 this 是 fn
  target["fn"] = this;
  //参数中去掉target
  let arg = [...arguments].shift();
  const result = target["fn"](...arg);
  delete target["fn"];
  return result;
};
Function.prototype._apply = function (target = window) {
  target["fn"] = this;
  let arg = [...arguments].shift();
  // 其实和call是一样的，因为都先转为数组再展开
  const result = target["fn"](...arg);
  delete target["fn"];
  return result;
};
```

### Function.prototype.bind

```js
// 注意在Function原型上绑定
Function.prototype.bind = function (context, ...args) {
  // 拿到fn.bind()的fn
  let fn = this;
  //这里用...rest为了实现foo.bind(null,"a","b")("c","d","e");
  return function (...rest) {
    return fn.apply(context, [...args, ...rest]);
  };
};
```

### 8.实现 Promise.all

```js
Promise.all = (promises) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    let result = [];
    const len = promises.length;
    if (len === 0) {
      return resolve([]);
    }

    promises.forEach((promise, i) => {
      // Promise.resolve用来包装一下，防止数组中不是promise而是基础类型
      // 而且就算是promise，Promise.resolve会继承参数中promise的状态
      Promise.resolve(promise)
        .then((res) => {
          count += 1;
          // 保证按顺序返回
          result[i] = res;
          if (count === len) {
            resolve(result);
          }
          // 一旦失败立即失败
        })
        .catch(reject);
    });
  });
};

// 写个使用例
const promise1 = new Promise((resolve, reject) =>
  setTimeout(() => resolve(1), 10)
);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(() => resolve(2), 10)
);
const promise3 = new Promise((resolve, reject) =>
  setTimeout(() => resolve(3), 10)
);
const promise4 = promise.reject(1);

const promises = [promise1, promise2, promise3, promise4];
Promise.all(promises).then((res) => {
  console.log(res);
});
```

### 实现 Promise.race

```js
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        (data) => {
          resolve(data);
          return;
        },
        (err) => reject(err)
      );
    }
  });
};
```

### 手写类型判断

```js
function getType(value) {
  // 判断数据是 null 的情况
  if (value === null) {
    return value + "";
  }
  // 判断数据是引用类型的情况
  if (typeof value === "object") {
    let valueClass = Object.prototype.toString.call(value),
      type = valueClass.split(" ")[1].split("");
    type.pop();
    return type.join("").toLowerCase();
  } else {
    // 判断数据是基本数据类型的情况和函数的情况
    return typeof value;
  }
}
```

### 2.归并

```js
// mergeSort(一个数组）
function mergeSort(nums) {
  if (nums.length < 2) return nums;
  const mid = parseInt(nums.length / 2);
  let left = nums.slice(0, mid);
  let right = nums.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

// merge（数组1，数组2）两个数组
function merge(left, right) {
  let res = [];
  let leftLen = left.length;
  let rightLen = right.length;
  let len = leftLen + rightLen;
  for (let index = 0, i = 0, j = 0; index < len; index++) {
    if (i >= leftLen) {
      res[index] = right[j++];
      continue;
    }
    if (j >= rightLen) {
      res[index] = left[i++];
      continue;
    }
    res[index++] = left[i] <= right[j] ? left[i++] : right[j++];
    // if (left[i] <= right[j]) res[index] = left[i ++];
    // else {
    //   res[index] = right[j ++];
    //   sum += leftLen - i;//求逆序对时在归并排序中唯一加的一行代码
    // 因为i后面的数肯定都满足大于右边的那一位，能组成逆序对
    // }
  }
  return res;
}

var arr = [3, 5, 7, 1, 4, 56, 12, 78, 25, 0, 9, 8, 42, 37];
var res = mergeSort(arr);
console.log(arr, res);
```

### promise 实现每隔 1 秒输出 1，2，3

```js
let arr = [1, 2, 3];
// 利用循环.then
arr.reduce((p, x) => {
  return p.then(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(console.log(x)), 1000);
    });
  });
  //初始值是Promise.resolve()
}, Promise.resolve());
```

### promise 实现红绿灯交替重复亮

```js
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}
//实现亮灯函数
function light(db, color) {
  return new Promise((res) => {
    setTimeout(() => {
      color();
      resolve();
    }, db);
  });
}
function main() {
  Promise.resolve()
    .then(() => {
      return light(3000, red);
    })
    .then(() => {
      return light(2000, yellow);
    })
    .then(() => {
      return light(1000, green);
    })
    .then(() => {
      return main();
    }); //执行完一轮再接上
}
main();
```

### 数组去重

```js
const unique = (arr) => {
  return Array.from(new Set(arr)); //先把arr转化成set类数组，然后再转化为数组
};

const unique = (arr) => {
  return [...new Set(arr)];
};

//双指针
const unique = (arr) => {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        arr.splice(j, 1);
        // *
        j--;
      }
    }
  }
  return arr;
};
```

### 合法的 URL

```js
const _isUrl = (url) => {
  // 去空格
  return /^((http|https):\/\/)?(( [A-Za-z0-9]+-[A-Za-z0-9]+ |[A-Za-z0-9]+)\.)+  ([A-Za-z]+)
                                                                            // 最后一段不带数字不带点
  (:\d+)?  (\/.*)?  (\?.*)?  (#.*)? $/.test(
  //端口号d+
    url
  );
};
```

### 全排列

```js
const _permute = (string) => {
  let result = [],
    arr = string.split("");
  const arrange = (left, right) => {
    if (left.length === arr.length) {
      result.push(left.join(""));
    } else {
      right.map((item, i) => {
        let temp = [...right];
        temp.splice(i, 1);
        arrange([...left, item], temp);
      });
    }
  };
  //启动
  arrange([], arr);
  return result;
};
```

### \_map

```js
// this是数组实例

Array.prototype._map = function (fn，outerThis=undefined){
    // 'function'是字符串
      if(typeof fn!=='function') return
      let newArr = []
      for(let i = 0;i<this.length;i++){
        // map(array[index],index,array)
        // 绑定外层传进来的this
          newArr[i] = fn.call(outerThis,this[i],i,this)
      }
      return newArr
  }
```

### filter

```js
Array.prototype._filter = function (fn) {
  if (typeof fn !== "function") return this;
  let res = [];
  this.forEach((item) => {
    if (fn(item)) {
      res.push(item);
    }
  });
  return res;
};
```

### 浅拷贝

```js
const _shallowClone = (target) => {
  // 补全代码
  // 基本数据类型
  if (typeof target !== "object" || target === null) return target;
  let ret = Array.isArray(target) ? [] : {};
  // Object.assign(ret, target);
  let str = Object.prototype.toString.call(target);
  // 函数，日期正则，直接返回
  if (
    str == "[object Date]" ||
    str == "[object RegExp]" ||
    str == "[object Function]"
  )
    return target;

  Object.keys(target).forEach((key) => {
    ret[key] = target[key];
  });
  return ret;
};
```

### 寄生组合式继承

```js
function inheritPrototype(subClass, superClass) {
  // 复制一份父类的原型
  var tem = Object.create(superClass.prototype);
  // 修正构造函数
  tem.constructor = subClass;
  // 设置子类原型
  subClass.prototype = tem;
}

function Parent(name, id) {
  this.id = id;
  this.name = name;
  this.list = ["a"];
  this.printName = function () {
    console.log(this.name);
  };
}
Parent.prototype.sayName = function () {
  console.log(this.name);
};

function Child(name, id) {
  Parent.call(this, name, id); //***用子的参数，执行一遍父类的构造过程
  //相当于执行了this.name =id
  // this.name = name
  // .....节省了写多行赋值的时间
  // Parent.apply(this, arguments);
}
inheritPrototype(Child, Parent); //注意这里会覆盖Child的prototype
//所以对Child的prototype增加方法要放在这行语句后面,对parent的prototype增加方法要放在这行的前面
Chinese.prototype.getAge = function () {
  return this.age;
};
```

### 插入排序

```js
function Insertion(arr) {
  let len = arr.length;
  let preIndex, current;
  for (let i = 1; i < len; i++) {
    preIndex = i - 1;
    current = arr[i];
    // [2,3,5,7]  4, i=4,preIndex=3,current=4,
    while (preIndex >= 0 && current < arr[preIndex]) {
      // 7往右移，第二次5往右移
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}
```

### 数组转树

```js
// 例如将 input 转成output的形式
let input = [
  {
    id: 1,
    val: "学校",
    parentId: null,
  },
  {
    id: 2,
    val: "班级1",
    parentId: 1,
  },
  {
    id: 3,
    val: "班级2",
    parentId: 1,
  },
  {
    id: 4,
    val: "学生1",
    parentId: 2,
  },
  {
    id: 5,
    val: "学生2",
    parentId: 2,
  },
  {
    id: 6,
    val: "学生3",
    parentId: 3,
  },
];

let output = {
  id: 1,
  val: "学校",
  children: [
    {
      id: 2,
      val: "班级1",
      children: [
        {
          id: 4,
          val: "学生1",
          children: [],
        },
        {
          id: 5,
          val: "学生2",
          children: [],
        },
      ],
    },
    {
      id: 3,
      val: "班级2",
      children: [
        {
          id: 6,
          val: "学生3",
          children: [],
        },
      ],
    },
  ],
};

// 代码实现
function arrayToTree(array) {
  // 假设数组第一项，为根数组
  let root = array[0];
  array.shift();
  let tree = {
    id: root.id,
    val: root.val,
    // 由于会把根元素shift出去，所以数组长度会减少,*只会减少一次
    children: array.length > 0 ? toTree(root.id, array) : [],
  };
  return tree;
}

// 传入父节点id，和没有根元素的array
function toTree(parenId, array) {
  let children = [];
  let len = array.length;
  for (let i = 0; i < len; i++) {
    let node = array[i];
    if (node.parentId === parenId) {
      children.push({
        id: node.id,
        val: node.val,
        // 没有child，toTree会返回children初值[],所以不用担心
        children: toTree(node.id, array),
      });
    }
  }
  return children;
}

console.log(arrayToTree(input));
```

---

### 树转数组

```js
let node = {
  id: 0,
  parentId: null,
  name: "生物",
  children: [
    {
      id: 1,
      parentId: 0,
      name: "动物",
      children: [
        {
          id: 4,
          parentId: 1,
          name: "哺乳动物",
          children: [
            {
              id: 8,
              parentId: 4,
              name: "大象",
            },
            {
              id: 9,
              parentId: 4,
              name: "海豚",
            },
            {
              id: 10,
              parentId: 4,
              name: "猩猩",
            },
          ],
        },
        {
          id: 5,
          parentId: 1,
          name: "卵生动物",
          children: [
            {
              id: 11,
              parentId: 5,
              name: "蟒蛇",
            },
            {
              id: 12,
              parentId: 5,
              name: "麻雀",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      parentId: 0,
      name: "植物",
      children: [
        {
          id: 6,
          parentId: 2,
          name: "种子植物",
        },
        {
          id: 7,
          parentId: 2,
          name: "蕨类植物",
        },
      ],
    },
    {
      id: 3,
      parentId: 0,
      name: "微生物",
    },
  ],
};

function transArr(node) {
  let queue = [node];
  let data = []; //返回的数组结构
  while (queue.length !== 0) {
    //当队列为空时就跳出循环
    let item = queue.shift(); //取出队列中第一个元素
    data.push({
      id: item.id,
      parentId: item.parentId,
      name: item.name,
    });
    let children = item.children; // 取出该节点的孩子
    if (children) {
      for (let i = 0; i < children.length; i++) {
        queue.push(children[i]); //将子节点加入到队列尾部
      }
    }
  }
  return data;
}
console.log(transArr(node));
```

### proxy 实现响应式

```js
// 创建响应式
function reactive(target = {}) {
  if (typeof target !== "object" || target == null) {
    // 不是对象或数组，则返回
    return target;
  }

  // proxy的代理配置，单独拿出来写
  const proxyConf = {
    get(target, key, receiver) {
      // 只处理本身（非原型的）属性
      const ownKeys = Reflect.ownKeys(target);
      if (ownKeys.includes(key)) {
        console.log("get", key); // 监听
      }

      const result = Reflect.get(target, key, receiver);

      // 深度监听，因为是触发了get，才会进行递归处理，所以性能会更好些
      return reactive(result);
    },
    set(target, key, val, receiver) {
      // 重复的数据，不处理
      if (val === target[key]) {
        return true;
      }

      const ownKeys = Reflect.ownKeys(target);
      if (ownKeys.includes(key)) {
        console.log("已有的 key", key);
      } else {
        console.log("新增的 key", key);
      }

      const result = Reflect.set(target, key, val, receiver);
      console.log("set", key, val);
      return result; // 是否设置成功
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key);
      console.log("delete property", key);
      return result; // 是否删除成功
    },
  };

  // 生成代理对象
  const observed = new Proxy(target, proxyConf);
  return observed;
}

// 测试数据
const data = {
  name: "xiaoming",
  age: {
    young: 18,
    old: 26,
  },
};

const proxyData = reactive(data);
```

### 打印质数

```js
for (let i = 2; i <= num; i++) {
  for (let j = 1; j * j < i; j++) {
    if (i % j === 0 && j !== 1) {
      res.push(i);
      break;
    }
  }
}
```

### 洗牌算法

```js
function FYShuffle(arr) {
  let len = arr.length;

  while (len > 1) {
    let rand = Math.floor(Math.random() * len);
    len--;
    [arr[len], arr[ran]] = [arr[ran], arr[len]];
  }

  return arr;
}
```

### Object.defineProperty

```js
const obj = { name: "xxx" };

// 添加具有数据描述符的属性，相当于 obj.age = 18
Object.defineProperty(obj, "age", {
  configurable: true, // 可删除
  enumerable: true, // 可枚举
  value: 18,
  writable: true, // 可重写
});

// 添加具有存取描述符的属性
let age = 18;
Object.defineProperty(obj, "age", {
  configurable: true,
  enumerable: true,
  get() {
    return age;
  },
  set(newVal) {
    age = newVal;
  },
});
```

### 封装带有超时（重试）机制的异步请求工具函数

```js
const defaultOptions = {
  timeout: 5000,
  retry: 3,
};

const timeout = (timeout = defaultOptions.timeout) =>
  new Promise((_, reject) =>
    // timeout的时间
    setTimeout(() => reject(new Error("timeout")), timeout)
  );

const request = async (url, fetchOption, options = defaultOptions) => {
  let times = 0;
  // 新promise,race
  const _request = () =>
    Promise.race([fetch(url, fetchOption), timeout(options.timeout)]);
  while (times < (options.retry || defaultOptions.retry)) {
    try {
      return await _request();
    } catch (err) {
      ++times;
      continue;
    }
  }
  // 这里抛出错误了，所以可以被catch到
  throw new Error("fetch failed");
};
```

### 手写 reduce

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
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### 9.useEffectOnce()

```js
import { useRef, useEffect, EffectCallback } from "react";

// 因为依赖数组必须useEffect第一个参数里的包括所有状态，否则会报错，所以用useRef可以解决这个
export function useEffectOnce(effect: EffectCallback) {
  const ref = useRef(effect);
  useEffect(() => ref.current(), []);
}
```

### 15.useClickOutside()

使用的时候给固定的标签绑定导出的 ref

```js
function Component() {
  // 定义回调函数
  const ref = useClickOutside(() => {
    alert("clicked outside");
  });
  // 把ref和标签绑定
  return <div ref={ref}>..</div>;
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
import { EffectCallback, DependencyList } from "react";

// 来自react的类型
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  // your code here
  const ref = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      return;
    }

    // effect参数的返回结果是清理函数，拿到清理函数
    // 手动调用
    const cleanup = effect();

    return () => {
      cleanup && cleanup();
    };
  }, deps);
}
```

### 17.useHover

```tsx
function App() {
  const [ref, isHovered] = useHover();
  return <div ref={ref}>{isHovered ? "hovered" : "not hovered"}</div>;
}
```

```tsx
import { Ref, useRef, useState, useEffect } from "react";

// 第一个参数如果有一定要是dom
export function useHover<T extends HTMLElement>(): [
  Ref<T | undefined>,
  boolean
] {
  const ref = useRef<T>();
  const [isHovering, setHovering] = useState(false);
  useEffect(() => {
    // false by default if ref.current changes
    setHovering(false);

    const element = ref.current;
    if (!element) return;

    const setYes = () => setHovering(true);
    const setNo = () => setHovering(false);

    element.addEventListener("mouseenter", setYes);
    element.addEventListener("mouseleave", setNo);

    return () => {
      element.removeEventListener("mouseenter", setYes);
      element.removeEventListener("mouseleave", setNo);
    };
  }, [ref.current]); // 如果ref.current变了,也要重新执行
  return [ref, isHovering];
}
```

### useParams

利用 window.location.href

```js
function parseParam(url) {
  const [href, params] = url.split("?");
  const result = {};
  params &&
    params.split("&").map((item) => {
      let [key, value = true] = item.split("=");
      value = value === true ? value : decodeURIComponent(value); // 转译中文
      if (!result[key]) {
        result[key] = value;
      } else {
        // 如果不是数组，则只有一个数，要加上value的话则concat生成个数组
        result[key] =
          result[key] instanceof Array
            ? [].concat(...result[key], value)
            : [].concat(result[key], value);
      }
    });
  return result;
}

// 执行
parseParam(
  "http://www.getui.com?user=superman&id=345&id=678&city=%E6%9D%AD%E5%B7%9E&enabled"
);

// {user: "superman", id:["345", "678"], city: "杭州", enabled: true}
```
