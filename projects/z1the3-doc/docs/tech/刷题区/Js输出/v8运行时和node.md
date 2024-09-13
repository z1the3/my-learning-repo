# V8 运行时和 node

在 V8 中，全局对象是 window ，在 Node 中，全局对象是 global ，关键在于，V8 会把全局的 var/function 绑定到 window 对象上，而 Node 不会将其绑定到 global 上，这就可能造成全局变量没有定义的问题

因为变量向外找找到 window 对象而不是 global 对象
