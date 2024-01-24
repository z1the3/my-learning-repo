# typescript 类型体操

## Pick

从接口IA中提取出新的**类型**

```ts
interface IA{
    a:string
    b:string
    c:string
}

type typeB = Pick<IA,'a'|'b'>

const insB: typeB = {
    a:'1',
    b:'2'
}
```

```ts
// 在定义时限制extends，可以使传入T中不存在值时报错
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```