# http 状态码

HTTP 响应状态码

100 continue 客户端应该继续请求，如果已经完成请忽略
101 switching protocols 客户端携带 Upgrade 请求头后触发，表明即将切换协议
102 processing 服务器已收到并正在处理，没响应可用
103 early hints 主要与 link 标签使用，允许用户预加载

200 OK 请求成功，返回结果携带了资源
201 created 请求成功，并创建了一个新资源 （多出现于 POST 或某些 PUT）
202 Accepted 请求已收到，但目前还没结果可响应（类似 102）
203 Non-authoritative Information 请求成功，但是返回的实体头部元信息不是预期的
204 No content 没有内容可发送，但头部字段可能有用。用户代理可能会用此时请求头部信息来更新原来资源的头部缓存字段。
205 Reset Content
206 Partial Content

300 Multiple Choice 请求有多个可能的响应
301 Moved Permanently 永久重定向，响应中给出了新的 URL
302 Found 临时重定向
303 See Other 别看这个，去 get 我指定的 URI 里的内容
304 Not Modified 缓存没有变动，浏览器可使用缓存
307 Temporary Redirect 跟 302 一样，但是重定向后的请求方法用过与之前一样
308 Permanent Redirect 跟 301 一样，同上

400 Bad Request 客户端错误的请求语法或请求路由，服务端不会处理请求
401 unauthorized 没权限
402 需要支付
403 Forbidden 禁止
404 Not Found 资源不存在，但是经常用于代替 403
405 Method Not Allowed 请求方法不支持
429 too many requests

500 Internal Server Error 服务端不知道怎么处理，服务器内部出错了
501 Not Implemented 不支持的请求方法
502 Bad gateway 网关没得到正确响应
503 service unavailable 服务器宕机中
504 gateway timeout 网关超时
505 HTTP 版本不支持
