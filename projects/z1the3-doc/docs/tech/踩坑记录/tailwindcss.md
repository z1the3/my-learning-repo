# tailwindcss

## 多库龙支持 tw

https://tailwindcss.com/docs/guides/create-react-app

## tw-merge

增加类型提示

```js
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
