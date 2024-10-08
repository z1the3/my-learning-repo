# Promise

> allsettled 和 any 都一定会返回兑现的 promise

### Promise.any()

Promise.any() 方法是 Promise 并发方法之一。该方法对于返回第一个兑现的 Promise 非常有用。一旦有一个 Promise 兑现，它就会立即返回，因此不会等待其他 Promise 完成。

Promise.any() 会以第一个兑现的 Promise 来兑现，**即使有 Promise 先被拒绝**。这与 Promise.race() 不同，后者会使用第一个敲定的 Promise 来兑现或拒绝。

### Promise.allSettled()

静态方法将一个 Promise 可迭代对象作为输入，并返回一个单独的 Promise。当所有输入的 Promise 都已敲定时（包括传入空的可迭代对象时），返回的 Promise 将被兑现，并带有描述每个 Promise 结果的对象数组。

只关心是否都敲定，不关心结果

### Promise.all()

Promise.all() 静态方法接受一个 Promise 可迭代对象作为输入，并返回一个 Promise。当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值的数组。如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因
