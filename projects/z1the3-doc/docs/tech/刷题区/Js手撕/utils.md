# 非原生 utils

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

## 发布订阅模式

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
    // 箭头函数
    const f = (data) => {
      callback(data);
      this.off(event, f);
    };
    this.on(event, f);
  }
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
