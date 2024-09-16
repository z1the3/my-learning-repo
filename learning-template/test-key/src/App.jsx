import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
(function () {
  // 检查是否已经存在 dataset
  if (!document.dataset) {
    // 使用 Object.create(null) 创建一个没有原型链的空对象，防止与任何默认对象属性冲突
    var customDataset = Object.create(null);

    // 添加你需要的属性
    customDataset.preventsidershortcut = true;

    // 使用 defineProperty 将该对象绑定到 document 上
    Object.defineProperty(document, "dataset", {
      value: customDataset,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else {
    // 如果 dataset 已存在, 直接设置属性
    document.dataset.preventsidershortcut = true;
  }
})();
function App() {
  const inputRef = useRef(null);

  function ta(ref) {
    const event = new KeyboardEvent("keydown", {
      key: "p", // 按键的值
      code: "KeyP", // 按键的代码
      keyCode: 80, // 按键的键码
      charCode: 0,
      shiftKey: false, // 是否按下 Shift 键
      ctrlKey: true, // 是否按下 Ctrl 键
      metaKey: true, // 是否按下 Meta 键 (Command 键在 Mac 上)
      altKey: false, // 是否按下 Alt 键
      bubbles: true, // 事件是否冒泡
      cancelable: true, // 事件是否可以取消
    });
    ref.dispatchEvent(event);
  }
  useEffect(() => {
    console.log(navigator.plugins);
    setTimeout(() => {
      ta(inputRef.current);
      console.log(111);
    }, 4000);
  }, [inputRef.current]);

  return (
    <>
      <div ref={inputRef}>11111</div>
      <button
        onClick={() => {
          ta(inputRef.current);
        }}
      >
        on
      </button>
    </>
  );
}

export default App;
