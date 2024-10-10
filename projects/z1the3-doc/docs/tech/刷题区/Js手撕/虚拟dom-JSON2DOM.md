# 虚拟 Dom/JSON2DOM

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
