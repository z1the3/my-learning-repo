# jwt

## 结构

它是一个很长的字符串，中间用点（.）分隔成三个部分。注意，JWT 内部是没有换行的，这里只是为了便于展示，将它写成了几行。

JWT 的三个部分依次如下。

```
Bearer (约定俗称的开头)
Header（头部）
Payload（负载）
Signature（签名）
```

### Header

Header 部分是一个 JSON 对象，描述 JWT 的元数据，通常是下面的样子。

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

上面代码中，alg 属性表示签名的算法（algorithm），默认是 HMAC SHA256（写成 HS256）；typ 属性表示这个令牌（token）的类型（type），JWT 令牌统一写为 JWT。

最后，将上面的 JSON 对象使用 Base64URL 算法（详见后文）转成字符串。

### Payload

Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了 7 个官方字段，供选用。

```
iss (issuer)：签发人
exp (expiration time)：过期时间
sub (subject)：主题
aud (audience)：受众
nbf (Not Before)：生效时间
iat (Issued At)：签发时间
jti (JWT ID)：编号
```

除了官方字段，你还可以在这个部分定义私有字段

```
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

### Signature

Signature 部分是对前两部分的签名，防止数据篡改。

首先，需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点"（.）分隔，就可以返回给用户。

## Base64URL

前面提到，Header 和 Payload 串型化的算法是 Base64URL。这个算法跟 Base64 算法基本类似，但有一些小的不同。

JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符+、/和=，在 URL 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成\_ 。这就是 Base64URL 算法。

## 特点

（1）JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。

（2）JWT 不加密的情况下，不能将秘密数据写入 JWT。

（3）JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以**降低服务器查询数据库的次数。**
（比如用户一些长期不改变的数据，可以直接从 jwt 中取）

（4）JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。

（5）JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。

（6）为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。

## JWT 与 Cookie 的结合方式

服务器把状态信息通过 JWT 序列化转化成 Token（JWT Token），

通过 HTTP 响应头字段 Set-Cookie 传输给用户代理，

用户代理通过 HTTP 请求头字段 Cookie 把 JWT Token 传回给服务器，

服务器使用 JWT 反序列化得到状态信息。

## Session VS JWT

### JWT 相对 Session 的优点

- 节省了服务器的存储空间
- 规避了分布式系统中的状态数据的存储同步问题

### JWT 相对 Session 的缺点

- 增加 Cookie 的体积(jwt 字符串)
- 耗费了服务器的算力，占用了服务器 CPU 资源
  加密和解密是比较耗费 CPU 的计算资源的。大家平时接触比较多的是 HTTPS 协议中数据的加密和解密。SSL 卸载（SSL Offloading）可以降低业务服务器的对 HTTPS 数据的加密和解密负担
