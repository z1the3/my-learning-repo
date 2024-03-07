# html

## 1.事件委托

```js
document.querySelector("ul").onclick = (event) => {
  event = event || window.event;
  if (event.target.nodeName.toLowerCase() === "li") {
    event.target.innerText += ".";
  }
};
```
