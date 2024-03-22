# utils

## 统计当前网页出现过多少个 html 标签

```js
new Set([...document.getElementsByTagName("*")].map((v) => v.tagName)).size;
```

## JSON2DOM

```js
{
  tag: 'DIV',
  attrs:{
  id:'app'
  },
  children: [
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] }
      ]
    },
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] },
        { tag: 'A', children: [] }
      ]
    }
  ]
}
把上诉虚拟Dom转化成下方真实Dom
<div id="app">
  <span>
    <a></a>
  </span>
  <span>
    <a></a>
    <a></a>
  </span>
</div>
```

```js
// 真正的渲染函数，我们要用到document的createTextNode,createElement,setAttribute
// appendChild
function _render(vnode) {
  if (!vnode) return null;
  // 如果是数字类型转化为字符串
  if (typeof vnode === "number") {
    vnode = String(vnode);
  }
  // 字符串类型直接就是文本节点
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }
  // 普通DOM，根据tag createElement
  const dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    // 遍历属性,(是个对象
    Object.keys(vnode.attrs).forEach((key) => {
      const value = vnode.attrs[key];
      // 手动给dom设置上attribute
      dom.setAttribute(key, value);
    });
  }
  // 子数组进行递归操作，先序遍历
  vnode.children.forEach((child) => dom.appendChild(_render(child)));
  return dom;
}
```

## 观察者模式

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

## 解析 url 的 params

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

## 找到出现次数最多的单词

先对字符串做处理

```js
function findMostWord(article) {
  // 合法性判断
  if (!article) return;
  // 参数处理
  article = article.trim().toLowerCase(); //"i want to"
  // 该步为了给左右加两个空格，并且将所有的word做成表
  let wordList = article.match(/[a-z]+/g), //["i","want","to"]
    visited = [],
    maxNum = 0,
    maxWord = "";
  article = " " + wordList.join("  ") + " "; // " i want to "
  // 遍历判断单词出现次数
  wordList.forEach(function (item) {
    // 数组也能用indexof
    if (visited.indexOf(item) < 0) {
      // 加入 visited
      visited.push(item);
      // 创建正则表达式，匹配" word ",生成的数组长度就是单词个数
      let word = new RegExp(" " + item + " ", "g"),
        num = article.match(word).length;
      if (num > maxNum) {
        maxNum = num;
        maxWord = item;
      }
    }
  });
  return maxWord + "  " + maxNum;
}
```

## 柯里化

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

## 防抖节流

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

## lodash.get

```js
function _get(obj, path, defaultValue = "undefined") {
  //先将path处理成统一格式
  let newPath = [];
  if (Array.isArray(path)) {
    newPath = path;
  } else {
    // 字符串类型 obj[a] obj.a  这里把'[' 替换成'.' ']' 替换成''
    newPath = path.replace(/\[/g, ".").replace(/\]/g, "").split("."); //最后转成数组
    console.log(newPath);
  }
  //obj 替换成 obj.a 逐步调用
  return (
    newPath.reduce((o, k) => {
      return (o || {})[k];
    }, obj) || defaultValue
  );
}

var object = { a: [{ b: { c: 3 } }] };

console.log(_get(object, "a[0].b.c"));
// => 3

console.log(_get(object, ["a", "0", "b", "c"]));
// => 3

console.log(_get(object, "a.b.c", "default"));
// => 'default'
```

## RGB/RGBA 颜色转十六进制

```js
function rgbToHex(val) {
  //RGB(A)颜色转换为HEX十六进制的颜色值
  let r, g, b, a;
  let regRgba = /rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([.\d]+))?\)/, //判断rgb颜色值格式的正则表达式，如rgba(255,20,10,.54)
    // replace过滤掉字符串中多余的空格
    // match返回一个数组或null，匹配成功返回regRgba对val的匹配结果数组，匹配失败返回null
    // 比如字符串rgba(255,20,10,.54)，如果匹配成功，返回：['rgba(255,20,10,.54)','255','20','10',',.54','.54',index:0,input:'rgba(255,20,10,.54)',groups:undefined]
    rsa = val.replace(/\s+/g, "").match(regRgba);

  // 如果匹配成功
  if (!!rsa) {
    r = parseInt(rsa[1]).toString(16);
    // 长度是1则前面补0，将长度补全为2位
    r = r.length == 1 ? "0" + r : r;
    g = parseInt(rsa[2]).toString(16);
    g = g.length == 1 ? "0" + g : g;
    b = parseInt(rsa[3]).toString(16);
    b = b.length == 1 ? "0" + b : b;
    // +作用可以理解为：Number(value)，将括号内的变量转换为Number类型
    a = +(rsa[5] ? rsa[5] : 1) * 100;
    return {
      hex: "#" + r + g + b,
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      alpha: Math.ceil(a),
    };
  } else {
    return { hex: "无效", alpha: 100 };
  }
}
```
