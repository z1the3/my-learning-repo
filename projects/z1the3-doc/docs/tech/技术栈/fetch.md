# fetch API

## 二次封装 fetch

```js
interface Config extends RequestInit {
    token?: string
    data?: object
}
// endpoint是要拼上去的字符串
export const http = async (
    endpoint: string,
    { data, token, headers, ...customConfig }: Config = {}
) => {
    const config = {
        // method默认为get,customConfig可以覆盖
        method: 'GET',
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-type': data ? 'application/json' : '',
        },
        ...customConfig,
    }

    if (config.method.toUpperCase() === 'GET') {
        endpoint += `?${qs.stringify(data)}`
    } else {
        // 发的是post请求
        config.body = JSON.stringify(data || {})
    }
    return window
        .fetch(`${apiUrl}/${endpoint}`, config)
        .then(async (response) => {
            if (response.status === 401) {
                await auth.logout()
                // 刷新页面
                window.location.reload()
                return Promise.reject({ message: '请重新登录' })
            }
            const data = await response.json()
            if (response.ok) {
                return data
            } else {
                return Promise.reject(data)
            }
        })
}

```
