# utils

## 统计当前网页出现过多少种 html 标签

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

## 实现柯里化

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

## 防抖节流（闭包）

防抖最终一定执行（一直取消）
节流则一定会执行

```js
function debounce(fn, wait) {
  let timer = null;

  return function () {
    // 注意args在这取，拿到返回function的参数
    const args = [...arguments];

    // 如果已经有，则清，到时间完再做
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 设置定时器，使事件间隔指定事件后执行

    // 使用外界this，从而可以被call,单纯箭头函数没有this
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
      preTime = nowTime;
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
    // 只有在未开启定时器时才会开启，并不会覆盖；开启了就会占着走完执行
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

## 数组转树

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
    // 由于会把根元素shift出去，所以数组长度会减少,于是看一下arr.length*只会减少一次
    children: array.length > 0 ? toTree(root.id, array) : [],
  };
  return tree;
}

// 传入父节点id，和没有根元素的array
function toTree(parentId, array) {
  let children = [];
  let len = array.length;
  for (let i = 0; i < len; i++) {
    let node = array[i];
    if (node.parentId === parentId) {
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
```

---

## 树转数组(bfs 队列)

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

## 实现 parseInt

```js
const _parseInt = (str, radix) => {
 // 不为string类型先转化为string 类型
 if (typeof str !== 'string') str = String(str)
 // 删除⾸尾空⽩
 str = str.trim()
 // 正则匹配[+|-]?[0]?[Xx]?[0-9a-fA-F]+
 const regex = /^(?<fuhao>[\+|\-]*)(?<radix>[0]?[Xx]?)(?<num>[0-9a-fA￾F]+)/
 // ⽆法匹配返回NaN
 if (!regex.test(str)) return NaN
 // 匹配出符号、进制、数字三个分组
 const groups = str.match(regex).groups
 // radix的有效范围为 2-36
 if (radix && (radix < 2 || radix > 36)) return NaN
 // 如果没有指定radix, radix 会有以下默认值
 if (!radix) {
 if (groups.radix.toUpperCase() === '0X') radix = 16
 else if (groups.radix === '0') radix = 8
 else radix = 10
 }
 // 挨个字符串解析，如果遇到⽆法解析时则停⽌解析，返回已经解析好的整数
 let splitArr = groups.num.split('')
 const arr = []
 for(let i = 0; i < splitArr.length; i++) {
 // 根据charCode来做转⾏为实际数据, 0-9为[48-57],A-F为[65-70]
 const charCode = splitArr[i].toUpperCase().charCodeAt()
 let num
 // 字符为[A-F]时, 实际数字为charCode -55
 if(charCode >= 65) num = charCode - 55
 // 字符为[0-9]时, 实际数字为charCode - 48
 else num = charCode - 48
 // 当实际数字⼤于radix时, ⽆法解析则停⽌字符串遍历
 if (num > radix) {
 break
 } else {
 arr.push(num)
 }

 const len = arr.length
 // 当实际数字数组⻓度为0时, 返回NaN
 if(!len) return NaN
 let result = 0
 // 依次解析实际数字数组, 组合成真正的数字
 for(let i = 0; i < len; i++) {
 const num = arr[i] * Math.pow(radix, len - i - 1)
 result += num
 }
 // 算法匹配到的正负号
 return result * (groups.fuhao === '-' ? -1 : 1)
}
```

## Fisher–Yates 洗牌算法

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

## 生成特定范围和长度的随机数组

````js
// 参数 数组长度、最小范围、最大范围
function randomUniqueArr(len = 100, min = 0, max = 200) {
  if (max - min < len) {
    // 可生成数的范围小于数组长度
    return null;
  }
  const hash = [];
  while (hash.length < len) {
    // 使用round可以取到min和max
    const num = Math.round(Math.random() * max);
    if (num < min) continue;
    if (hash.indexOf(num) === -1) {
      hash.push(num);
    }
  }
  return hash;
}

console.log(randomUniqueArr());
console.log(randomUniqueArr(20, 10, 31));```
````
