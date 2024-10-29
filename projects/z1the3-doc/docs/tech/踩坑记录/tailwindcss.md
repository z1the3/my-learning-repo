# tailwindcss

## docusaurus 支持 tw

https://tailwindcss.com/docs/guides/create-react-app

不建议，tw 的 base 样式表和 docusaurus 默认样式冲突，

解决方法是需要把 tw 的 base 引入给去掉

或者直接用 preflight 功能（推荐）

但是 shadcn-ui 需要 tw 的 base 样式，目前想到的办法比较麻烦，对 shadcn-ui 样式重写

> 考虑过利用 tw 的 plugin addbase 把 tw 侧覆盖的部分影响展示的样式给还原
> 但是比较多，还原起来麻烦，而且有些存在继承的，就算还原了也不知道还要还原啥
> 目前只知道 h1 h2 h3
> https://tailwindcss.com/docs/plugins#adding-base-styles

### docusaurus 经过 swizzle 后的组件也需要重写样式

```js
<div className="navbar__inner">
  <div className="navbar__items">{left}</div>
  {/* 替换样式 */}
  {/* <div className="navbar__items navbar__items--right">{right}</div> */}
  <div
    className={clsx("navbar__items", styles["navbar__items--right--custom"])}
  >
    {right}
  </div>
</div>
```

```css
/* 删除原先的navbarItemsRight样式 */
.navbar__items--right--custom {
  justify-content: flex-end;
  flex: 0 0 auto;
}

.navbar__items--right--custom > :last-child {
}
```

## tw-merge

增加类型提示

```js
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## preflight

https://tailwindcss.com/docs/plugins#adding-base-styles
