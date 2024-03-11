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

### 1.实现柯里化

```js
const join = (a, b, c) => {
  return `${a}_${b}_${c}`;
};

const curriedJoin = curry(join);

curriedJoin(1, 2, 3); // '1_2_3'

curriedJoin(1)(2, 3); // '1_2_3'

curriedJoin(1, 2)(3); // '1_2_3'
```

```js
function curry(fn) {
  return function curried(...args) {
    // if number of arguments match
    if (args.length >= fn.length) {
      return fn.call(this, ...args);
    }
    return function (...missingArgs) {
      return curried.call(this, ...args, ...missingArgs);
    };
  };
}
```

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

#### async pool

```js
// asyncPool(3,[1,2,3,4],(i)=>new Promise(resolve,reject)
// {setTimeout(()=>{console.log(i).resolve(i)},100}}

async function asyncPool(poolLimit, iterable, iteratorFn) {
  const ret = [];
  const executing = new Set();
  for (const item of iterable) {
    const p = Promise.resolve().then(() => iteratorFn(item, iterable));
    ret.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    // 无论成功还是失败，都在executing中去掉这个
    p.then(clean).catch(clean);
    if (executing.size >= poolLimit) {
      // 卡住，但是一旦excuting中完成了一个，就会跳出
      await Promise.race(executing);
    }
  }
  // 确保返回的p不会最后一个没执行完
  return Promise.all(ret);
}
```

#### 1.发布订阅模式

```js
class EventHub {
  constructor() {
    // 存放event和map，map为对象，每个key为数组
    this.map = {};
  }
  on(event, fn) {
    this.map[event] = this.map[event] || [];
    this.map[event].push(fn);
  }
  emit(event, data) {
    const fnList = this.map[event] || [];
    if (fnList.length === 0) return;
    // 遍历该event的缓存列表，依次执行fn
    fnList.forEach((fn) => fn.call(undefined, data));
  }
  off(event, fn) {
    const fnList = this.map[event] || [];
    const index = fnList.indexOf(fn);
    if (index < 0) return;
    fnList.splice(index, 1);
  }
  once(event, callback) {
    // data暂时没东西传进去，但是用了 emit就可以被使用
    const f = (data) => {
      callback(data);
      this.off(event, f);
    };
    this.on(event, f);
  }
}
```

#### 观察者模式

```js
let watcher_ids = 0;
let dep_ids = 0;
// 观察者类
class Watcher {
  constructor() {
    this.id = watcher_ids++;
  }
  // 观察到变化后的处理
  update(ob) {
    console.log("观察者" + this.id + `-检测到被观察者${ob.id}的${ob.state}`);
  }
}

// 被观察者类
class Dep {
  constructor() {
    this.watchers = [];
    this.id = observed_ids++;
    this.state = "默认状态";
  }
  // 添加观察者
  addWatcher(watcher) {
    this.watchers.push(Watcher);
  }
  // 删除观察者
  removeWatcher(watcher) {
    this.watchers = this.watchers.filter((w) => w.id != watcher.id);
  }

  // 通知自己所有的观察者，ob可以为被观察者自身
  notify(ob) {
    this.watchers.forEach((watcher) => {
      watcher.update(ob);
    });
  }
}
```

#### 2. instanceof

```js
const _instanceof = (target, Fn) => {
  // 判断是不是基础数据类型
  if (target === null || typeof target !== "object") {
    return false;
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
};
```

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
    // getArrow在使用时，作用域被推到window上，因此上一层作用域是window
    var _this = this;
    return function () {
      console.log(_this === obj);
    };
  },
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
    return functions.reducer(
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

```js
const _new = function (constructor, ...args) {
  // new关键字做了4件事
  // 1. 创建一个新对象
  const obj = {};
  // 2. 为新对象添加属性__proto__，将该属性链接至构造函数的原型对象
  obj.__proto__ = constructor.prototype;
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

### 1.快排

```js
const _quickSort = (array) => {
  // 补全代码
  myQuickSort(array, 0, array.length - 1);
  return array;
};
// 启动函数

// 重点
function myQuickSort(array, l, r) {
  if (l < r) {
    let index = partition(array, l, r); //进行一轮快排
    myQuickSort(array, l, index - 1);
    myQuickSort(array, index + 1, r);
  }
}
function partition(array, l, r) {
  // 随机l-r取值
  let pivot = array[Math.floor(Math.random() * (r - l + 1)) + l];
  // *****这里是双重循环
  while (l < r) {
    while (array[l] < pivot) l++;
    while (array[r] > pivot) r--;
    // 此时其实都等于pivot
    if (l < r && array[l] == array[r]) l++;
    else if (l < r) {
      //此时array[l]>pivot,array[r]<pivot (=的情况已经排除)
      let t = array[l];
      array[l] = array[r];
      array[r] = t;
    }
  }
  //此时l==r
  return l;
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

### 3.hardman

```js
HardMan(“jack”) 输出:
I am jack

HardMan(“jack”).rest(10).learn(“computer”) 输出
I am jack
//等待10秒
Start learning after 10 seconds
Learning computer

HardMan(“jack”).restFirst(5).learn(“chinese”) 输出
//等待5秒,但是优先级比I am jack还搞·
Start learning after 5 seconds
I am jack
Learning chinese


class _HardMan {
    constructor(name) {
        this.tasks = []

        setTimeout(async () => {
            for (let task of this.tasks) {
                await task()
            }
        })

        this.tasks.push(() =>
            new Promise(resolve => {
                console.log(`I am ${name}`)
                resolve()
            })
        )
    }

    wait(sec) {
        return new Promise(resolve => {
            console.log(`//等待${sec}秒..`)
            setTimeout(() => {
                console.log(`Start learning after ${sec} seconds`)
                resolve()
            }, sec * 1000);
        })
    }


    rest(sec) {
        this.tasks.push(() => this.wait(sec))
        return this
    }

    restFirst(sec) {
        this.tasks.unshift(() => this.wait(sec))
        return this
    }

    learn(params) {
        this.tasks.push(() =>
            new Promise(resolve => {
                console.log(`Learning ${params}`)
                resolve()
            })
        )
        return this
    }
}

function HardMan(name) {
    return new _HarnMan(name)
}



// 解答分析：
// 1. 链式调用，每一个方法都返回this
// 2. 并不直接执行代码，而是使用SetTimeout，这样就先把想要执行的任务先放进队列再执行
// 3. wait 的使用，使用setTimeout，如果不用Promise把setTimeout包住，就无法堵塞后面代码的执行
// 4. 除了用Promise，也可以在每个任务中指定的调用下一个任务，如：
    next() {
        let task = this.tasks.shift()
        task && task()
    }

    wait(sec) {
      setTimeout(() => {
        //do something
        this.next()
      }, sec)
    }


```

### 实现 promise

```js
function Promise(fn) {
  this.cbs = [];

  const resolve = (value) => {
    setTimeout(() => {
      this.data = value;
      // 这个value，循环体现在 a.then();a.then();会增加cb;所以value值不变
      // 而a.then().then()其实是创造一个新的promise (a.then())来管理新cb，value值需要更新
      this.cbs.forEach((cb) => cb(value));
    });
  };
  // 执行器，很关键，一切从这开始
  fn(resolve);
}

Promise.prototype.then = function (onResolved) {
  // 返回一个新promise从而可以链式调用，而这个promise会立即往自身的cb里加入一个函数
  // 这个函数能保证then时，老promise resolve时会把新promise的onResolved执行了
  // 在调用resolve会遍历cb，并异步执行里面的函数，那么就会进而执行onResolved
  // 给完成结果加上then再resolve能再下一次异步执行res(promise)独享的cb2
  // 如果完成结果不是promise,直接通过resolve派发这一次then的结果，更新this.data
  return new Promise((resolve) => {
    this.cbs.push(() => {
      // 这一行则完成了.then((res)=>{})，并且将老promise的data传给新promise
      const res = onResolved(this.data);
      if (res instanceof Promise) {
        res.then(resolve);
      } else {
        resolve(res);
      }
    });
  });
};

new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
})
  .then((res) => {
    console.log(res);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 500);
    });
  })
  .then(console.log);
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

### 防抖节流

```js
function debounce(fn, wait) {
  let timer = null;

  return function () {
    const args = [...arguments];

    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

// 时间戳版
function throttle(fn, delay) {
  var preTime = Date.now();

  return function () {
    (args = [...arguments]), (nowTime = Date.now());

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - preTime >= delay) {
      preTime = Date.now();
      // 但是这个版本有return值
      return fn.apply(this, args);
    }
  };
}

// 定时器版
function throttle(fn, wait) {
  let timer = null;
  return function () {
    // 此处的arguments为 throttle(fn(1,2,3),wait)的[1,2,3]
    let args = [...arguments];
    // 只有在未开启定时器时才会开启，并不会覆盖
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        // 回收定时器
        timer = null;
      }, wait);
    }
  };
}
```

但是节流存在两种边界条件 1.如果使用定时器法，第一次执行，它**也会延迟 wait 毫秒执行**，我们希望第一次能立即执行；
使用时间戳法可以实现

2.如果使用时间戳法，最后一次是不执行的，因为判断之后发现没到 ddl，直接结束了
使用定时器法可以解决，最后一次必然会在定时器结束后执行

将两种方法结合可以解决这个问题

```js
function throttle(fn, delay) {
  let timer = null;
  let start = Date.now();
  return function () {
    let args = [...arguments];
    let curTime = Date.now();
    let remain = delay - (curTime - start);
    clearTimeout(timer); //***
    timer = null;
    if (remain <= 0) {
      fn(args);
      start = Date.now();
    } else {
      timer = setTimeout(() => fn.apply(this, args), remain);
    }
  };
}
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

### reduce

```js
// prev为初始值，可能为undefined
Array.prototype._reduce = function (fn, prev) {
  for (let i = 0; i < this.length; i++) {
    if (prev === undefined) {
      // 此时第一位和第二位为参数返回结果为初始值，当前应该在第二位所以i++
      // 修改参数prev
      prev = fn(this[i], this[i + 1], i + 1, this);
      i++;
    } else {
      // prev不为undefined了，所以将上一次的prev传进去
      prev = fn(prev, this[i], i, this);
    }
  }
  return prev;
};
```

### Object.create

```js
const _objectCreate = (proto) => {
  // 补全代码
  if (typeof proto !== "object") return;
  const fn = function () {};
  fn.prototype = proto;
  // 如果proto为null, 返回的是一个干净的对象
  return new fn();
};
```

### new

```js
const _new = function (constructor, ...args) {
  // new关键字做了4件事
  // 1. 创建一个新对象
  const obj = {};
  // 2. 为新对象添加属性__proto__，将该属性链接至构造函数的原型对象
  obj.__proto__ = constructor.prototype;
  // 3. 执行构造函数，this被绑定在新对象上
  const res = constructor.apply(obj, args);
  // 4. 确保返回一个对象
  return res instanceof Object ? res : obj;
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

### 深拷贝

```js
const _completeDeepClone = (target, map = new Map()) => {
  // 排除null 和 基本数据类型（直接返回
  if (target === null) return target;
  if (typeof target !== "object") return target;

  // 复制一份对象的构造函数名，如果是Function|RegExp|Date|Map|Set，则生成新的实例对象
  const constructor = target.constructor;
  if (/^(Function|RegExp|Date|Map|Set)$/i.test(constructor.name))
    return new constructor(target);

  // 在map中获取该对象，如果能获取到，说明该对象内部拥有外层的对象，为循环引用，返回map中该对象的值
  //
  if (map.get(target)) return map.get(target);

  // 根据参数的数据类型（通过isArray）判断克隆出的类型，并设result
  const cloneTarget = Array.isArray(target) ? [] : {};
  // 如果获取不到，则先保存到map中,这里cloneTarget是引用类型，所以最后的操作能影响这里
  map.set(target, cloneTarget);

  for (prop in target) {
    // 如果是target中非继承的属性
    if (target.hasOwnProperty(prop)) {
      // 将map传下去
      cloneTarget[prop] = _completeDeepClone(target[prop], map);
    }
  }
  return cloneTarget;
};
```

### flat

数组扁平化

```js
//拍到底
let arr = [1, [2, [3, 4, 5]]];
function flatten(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    // 当前元素是一个数组，对其进行递归展平
    if (Array.isArray(arr[i])) {
      // 递归展平结果拼接到结果数组
      result = result.concat(flatten(arr[i]));
    }
    // 否则直接加入结果数组
    else {
      result.push(arr[i]);
    }
  }
  return result;
}
console.log(flatten(a));
```

```js
// 递归拍n层
function flatten(arr, level) {
  function walk(arr, currLevel) {
    // 每次都准备好一个空数组
    let res = [];
    for (let item of arr) {
      // 判断有没有超过层数,放在for循环里面而不是外面,放在外面超过层数后
      //后面的数就不会加到arr里了
      if (Array.isArray(item) && currLevel < level) {
        // 记得walk的是新的item**和现有的curlevel+1**
        res = res.concat(walk(item, currLevel + 1));

        // res.push(...walk(item,currLevel + 1))也行
      } else {
        res.push(item);
      }
    }
    return res;
  }

  return walk(arr, 0);
}

var res = flatten(arr, 3);
console.log(res);
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

### 冒泡排序

```js
let arr = [3, 4, 1, 2];
function bubbleSort(arr) {
  let max = arr.length - 1;
  for (let j = 0; j < max; j++) {
    // 声明一个变量，作为标志位
    let done = true;
    for (let i = 0; i < max - j; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        done = false;
      }
    }
    // 如果一次遍历，没换一个，说明后面的都是升序的，不用再继续了
    if (done) {
      break;
    }
  }
  return arr;
}
bubbleSort(arr);
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
