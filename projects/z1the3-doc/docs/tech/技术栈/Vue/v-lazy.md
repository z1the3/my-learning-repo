# vue-lazy

图片懒加载自定义指令实现

## intersectionObsever

利用 `entry.isIntersecting` 方法

```js
new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
```

## ImageManager

```ts
export default class ImageManager {
  el: HTMLElement;
  parent: HTMLElement | Window;
  src: string;
  error: string;
  loading: string;
  cache: Set<string>;
  state: State;
}

// types目录
export enum State {
  loading,
  loaded,
  error,
}

// 初始化状态机，设置为loading
  constructor (options: ImageManagerOptions) {
    this.el = options.el
    this.parent = options.parent
    this.src = options.src
    this.error = options.error
    this.loading = options.loading
    this.cache = options.cache
    this.state = State.loading

    this.render(this.loading)
  }

// 强制渲染，loading预加载图必须强制渲染
// 通过在标签上添加src属性
  private render (src: string): void {
    this.el.setAttribute('src', src)
  }
```

## 插件本体

```ts
import Lazy from "./core/lazy";

const lazyPlugin = {
  install(app: App, options: LazyOptions) {
    const lazy = new Lazy(options);

    // 先安装插件，然后在app上增加自定义指令
    app.directive("lazy", {
      // 由于mounted设置方法会this丢失，必须要绑定this
      mounted: lazy.add.bind(lazy),
      updated: lazy.update.bind(lazy),
      unmounted: lazy.update.bind(lazy),
    });
  },
};

export default lazyPlugin;

//./types,在插件安装时默认好错误链接和加载链接
export interface LazyOptions {
  error?: string;
  loading?: string;
}
```

## 工具

找到最近的被设置了滚动的祖先元素，找不到返回 window

```js
// ./helpers/dom

const style = (el: HTMLElement, prop: string): string => {
  return getComputedStyle(el).getPropertyValue(prop)
}

const overflow = (el: HTMLElement): string => {
  return style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x')
}

export function scrollParent (el: HTMLElement): HTMLElement | Window {
  let parent = el

  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break
    }

    if (!parent.parentNode) {
      break
    }

    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent
    }

    parent = parent.parentNode as HTMLElement
  }

  return window
}
```

## 自定义指令 mounted 周期

```ts
  managerQueue: ImageManager[]

  add (el: HTMLElement, binding: DirectiveBinding): void {
    const src = binding.value
    const parent = scrollParent(el)

    const manager = new ImageManager({
      el,
      parent,
      src,
      error: this.error,
      loading: this.loading,
      cache: this.cache
    })

    // 每一张图片都有一个manager
    this.managerQueue.push(manager)

    // 如果浏览器不支持intersectionObserver
    // 需要通过检测滚动事件
    if (hasIntersectionObserver) {
      this.observer!.observe(el)
    } else {
      this.addListenerTarget(parent)
      this.addListenerTarget(window)
      this.throttleLazyHandler()
    }
  }

```

## 工具，判断浏览器是否支持 observer

```ts
const inBrowser = typeof window !== "undefined";

// 暴露函数的执行结果，hasXXX
export const hasIntersectionObserver = checkIntersectionObserver();

function checkIntersectionObserver(): boolean {
  if (
    inBrowser &&
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in IntersectionObserverEntry.prototype
  ) {
    // 为Edge15 手动实现 isIntersecting
    // 最小的polyfill
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!("isIntersecting" in IntersectionObserverEntry.prototype)) {
      Object.defineProperty(
        IntersectionObserverEntry.prototype,
        "isIntersecting",
        {
          get: function (this: IntersectionObserverEntry) {
            return this.intersectionRatio > 0;
          },
        }
      );
    }
    return true;
  }
  return false;
}
```

## 自定义指令初始化

```ts
// 两种情况，分别初始化
  private init (): void {
    if (hasIntersectionObserver) {
      this.initIntersectionObserver()
    } else {
      this.targetQueue = []
    }
  }

  private initIntersectionObserver (): void {
    // new一个observer
   this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 如果某个区块进入屏幕，找到对应的manager
          const manager = this.managerQueue.find((manager) => {
            // 元素相同，则是绑定自定义指令的图片
            return manager.el === entry.target
          })
          if (manager) {
            // 如果manager已经加载，移除manager
            if (manager.state === State.loaded) {
              this.removeManager(manager)
              return
            }
            // 加载图片
            manager.load()
          }
        }
      })
    }, {
      // 配置
      rootMargin: '0px',
      threshold: 0
    })
  }


// 对于已经缓存的图片，强制渲染
// next支持扩展
  load (next?: Function): void {
    if (this.state > State.loading) {
      return
    }
    if (this.cache.has(this.src)) {
      this.state = State.loaded
      this.render(this.src)
      return
    }
    this.renderSrc(next)
  }


   private renderSrc (next?: Function): void {
    loadImage(this.src).then(() => {
      this.state = State.loaded
      this.render(this.src)
      // 已经渲染一次的图片，浏览器已经自动缓存，在dom update时可以直接渲染
      // 因此加入到缓存中

      this.cache.add(this.src)
      next && next()
    }).catch((e) => {
      this.state = State.error
      this.render(this.error)
      warn(`load failed with src image(${this.src}) and the error msg is ${e.message}`)
      next && next()
    })
  }
```

**cache 是存在全局（Lazy 插件）中，因此即便 manager 卸载了，新的 manager 用到 cache 中的 src 能直接渲染**

```ts
export default class Lazy {
  cache: Set<string>;
}
```

## update 阶段

```ts
  update (el: HTMLElement, binding: DirectiveBinding): void {
    const src = binding.value
    const manager = this.managerQueue.find((manager) => {
      return manager.el === el
    })
    if (manager) {
      manager.update(src)
    }
  }

// imageManager
// src发生变动，状态会更新，并重新加载
// 加载是异步的，状态变为Loading时, Manager不会被删除
  update (src: string): void {
    const currentSrc = this.src
    if (src !== currentSrc) {
      this.src = src
      this.state = State.loading
      this.load()
    }
  }
```

## remove 阶段

```ts
  remove (el: HTMLElement): void {
    const manager = this.managerQueue.find((manager) => {
      return manager.el === el
    })
    if (manager) {
      this.removeManager(manager)
    }
  }
```

## 无 Observer 时的 polyfill

```js
// 节流
export function throttle(fn: Function, delay: number): Function {
  let timeout = 0;
  let lastRun = 0;
  return function (this: void) {
    if (timeout) {
      return;
    }
    const elapsed = Date.now() - lastRun;
    const context = this;
    const args = arguments;
    const runCallback = function () {
      lastRun = Date.now();
      timeout = 0;
      fn.apply(context, args);
    };
    if (elapsed >= delay) {
      runCallback();
    } else {
      timeout = window.setTimeout(runCallback, delay);
    }
  };
}
```

```ts
// 对该函数进行节流处理，不然每次滚动都会计算manager
private lazyHandler (e: Event): void {
    for (let i = this.managerQueue.length - 1; i >= 0; i--) {
      const manager = this.managerQueue[i]
      // 手动实现Observer
      if (manager.isInView()) {
        if (manager.state === State.loaded) {
          this.removeManager(manager)
          return
        }
        manager.load()
      }
    }
  }


    const THROTTLE_DELAY = 300
    this.throttleLazyHandler = throttle(this.lazyHandler.bind(this), THROTTLE_DELAY)
```

### isInView（）

```ts
// manager

//**
  isInView (): boolean {
    const rect = this.el.getBoundingClientRect()

    // 利用clientRect，rect.top是到视口顶部的距离
    return rect.top < window.innerHeight && rect.left < window.innerWidth
    // 还有一种方法是 offsetTop, scrollTop, innnerHeight
    //                     注意这是一条线，代表屏幕最下部分
    // img.offsetTop < window.innerHeight + document.body.scrollTop;
// !一旦图片经过这条线就下载，不是一定在视口内才下载
  }

```

### 初始化

```ts
this.addListenerTarget(parent);
this.addListenerTarget(window);
// 对所有manager进行节流后的监听：一旦进入view，加载或移除manager

// 初始化时对所有manager绑定一次

// 后面再所有元素的最近父元素发生滚动后，更新一次，决定是否load/取消绑定manager
this.throttleLazyHandler();
```

对被监听元素的父元素进行储存

```ts
  private addListenerTarget (el: HTMLElement | Window): void {

    let target = this.targetQueue!.find((target) => {
      return target.el === el
    })

    if (!target) {
      target = {
        el,
        ref: 1
      }
      this.targetQueue!.push(target)
// 此处元素的最近父元素发生滚动后，更新一次，决定是否load/取消绑定manager

      this.addListener(el)
    } else {
      target.ref++
    }
  }

```

因为需要对父元素监听滚动，实际产品中有滚动元素含滚动元素的情况

不能只在 window 上监听

```ts

const events = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove', 'transitioncancel']

  private addListener (el: HTMLElement | Window): void {
    events.forEach((event) => {
      el.addEventListener(event, this.throttleLazyHandler as EventListenerOrEventListenerObject, {
        passive: true,
        capture: false
      })
    })
  }

  private removeListener (el: HTMLElement | Window): void {
    events.forEach((event) => {
      el.removeEventListener(event, this.throttleLazyHandler as EventListenerOrEventListenerObject)
    })
  }


```

在 removeManager 时，同时 remove 父元素的 listener 和在全局的 listener

相同父元素被重复监听，会记录 ref，ref 变为 0 才彻底清除 target

```ts
  private removeListenerTarget (el: HTMLElement | Window): void {
    this.targetQueue!.some((target, index) => {
      if (el === target.el) {
        target.ref--
        if (!target.ref) {
          this.removeListener(el)
          this.targetQueue!.splice(index, 1)
        }
        return true
      }
      return false
    })
  }

```
