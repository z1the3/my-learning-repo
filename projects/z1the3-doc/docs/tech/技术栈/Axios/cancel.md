# Cancel

需求: 希望后面的请求发出去的时候，如果前面的请求还没有响应将前面的请求取消

原理:利用 xhr 的 abort

```js
// xhr.ts
// 解构赋值＋默认值
    const { data = null, method = 'get', url, headers,responseType,timeout,
cancelToken } = config


  // 发送前插入取消逻辑，如果promise变了，会异步触发这里
    if(cancelToken){
        cancelToken.promise.then(((reason: any)=>{
            request.abort()
            reject(reason)
        }))
    }
   request.send()
```

暴露 resolve 通过执行器函数

```js
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('xx',{cancelToken: source.token}).catch(function(e){
  if(axios.isCancel(e)){
    console.log('Request canceled',e.message)
  }
})

// 取消请求，取消原因为可选的
source.cancel('Operation canceled by the user.')


--------------另一种调用的方式，直接实例化对象，并通过执行器覆盖到外面的cancel上
const CancelToken = axios.CancelToken
let cancel


// c是由class内部生成一个resolvePromise的函数，我们可用通过传入executor
// 把c暴露给外界的cancel
axios.get('xx',{cancelToken: new CancelToken(function executor(c){
  cancel = c
})

// 取消请求
  cancel()
```

原理是在执行 cancel 时，执行 xhr 的 abort 方法

通过
在 cancelToken 中保存一个 pending 状态的 promise 对象，始终等待执行回调
在执行 cancel 时，将 promsie 对象改为 resolved 状态，这样就可以异步地在 then 函数中执行 xhr 实例.abort

```js
// cancelToken.ts
import { CancelExecutor } from "../types"

interface ResolvePromise  {
    (reason?:string):void
}


export default class CancelToken{
    promise: Promise<string|undefined>
    reason?:string
    constructor(executor: CancelExecutor){
        let resolvePromise: ResolvePromise

        this.promise = new Promise<string|undefined>(resolve=>{
            // 把resolve方法暴露到外界,而且不执行
            resolvePromise = resolve
        })

        //function executor(c){
        // cancel = c
        // } 把resolve函数通过执行器暴露出去
        executor(message=>{
            if(this.reason){
                return
            }
            this.reason = message
            resolvePromise(this.reason)
        })
    }


}

// 实现第二种触发方式
// xhr.ts
// 解构赋值＋默认值
    const { data = null, method = 'get', url, headers,responseType,timeout,
cancelToken } = config


  // 发送前插入取消逻辑，如果promise变了，会异步触发这里
    if(cancelToken){
        cancelToken.promise.then(((reason: any)=>{
            request.abort()
            reject(reason)
        }))
    }
   request.send()

// 实现第一种触发方式, source函数直接帮我们自动创建CancelToken，并返回cancel方法
// 和CancelToken类(感觉用处不是很大?)

而使用第二种触发方式在内部手动new CancelToken 然后直接返回出来，第一种是外部new CancelToken
// static
    static source(): CancelTokenSource {
        let cancel!: Canceler
        const token = new CancelToken(c=>{
            cancel = c
        })

        return {
            cancel,
            token
        }
    }

// 所有取消message都应该在调用.cancel时传入
```

```js
// 取消发送相关


export interface CancelToken{
    promise: Promise<string>
  // reason就是message，在每次执行cancel后会覆盖CancelToken中的message
    reason?: string
}

// 这是cancel函数，传入message，执行后改变CancelToken类中的promise
export interface Canceler{
    (message?: string):void

}

// 这是传入CancleToken 构造器的执行器，cancel在CancelToken的constructor中传入
// 然后我们可用在外界拿到cancel,并暴露到外界
export interface CancelExecutor {
    (cancel:Canceler):void
}
```
