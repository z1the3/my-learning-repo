# typescript

### 工具函数

```ts

type a = Array<{a:string}&({b:boolean}|{c:number})>
即{a:string;b:boolean}或{a:string;c:number}

// 工具类型都是用类型别名实现的
 ts写在泛型<>中的typeof和js中不同，是在编译时就执行，js的typeof只有运行时才执行
[Aa,Ab]: Parameters<type A>

// interface不能使用
 type Person = {
   name: string,
   age: number
 }
// Partial会对type中每一个做？处理
const xiaoMing: Partial<Person> ={age:13}
// 也可以形成一个新type
type a = Partial<A>

// 会对type中去掉一个类型
const xiaoAi: Omit<Person,'name'>={age:13}
const xiaoAi: Omit<Person,'name'|'age'>={}
type A = Exclude<a,'name'>

// 但是exclude是从联合类型&中去掉一个，omit是从键值对中去掉一个

完全复制
type a<T> = {
 [P in keyof T]: T[P]
}
// Partial的实现,重点在于？
type Partial<T> = {
 [P in keyof T]?: T[P]
}

// K必须要在T的键集合当中
type Pick<T,    K extends keyof T> = {
 [P in K]: T[P]
}
// 如果T在U中则返回never，否则返回T   由于是联合类型，不能用keyof
type Exclude<T,U> = T extends U? never: T

// K extends keyof any保证可以填联合类型,挨个pick出不是K的
type Omit<T,K extends keyof any> = Pick<T, Exclude<keyof T,K>>



```
