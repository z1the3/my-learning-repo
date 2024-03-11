# 大文件上传

## 服务端

服务端接收切片后，需要去合并切片。那么产生如下两个问题

怎么取合并切片
什么时候知道切片上传完成了

对于第一个问题我们可以使用 fs-extra 的读写流进行合并。
第二个问题我是解决办法是在每个请求的参数加一个文件总切片长度，对于每个切片我是的命名规则是 name.suffixName_index,其中 suffixName 是后面明，name 可以使用你的文件名，index 是上传的第一个分片的 index 值，这样交给后端，后端沟通好就使用这个去区分。接下来我们就实现吧。

## 前端切片

我们使用 upload 组件去获取文件，对于文件切片，

核心就是利用 Blob.prototype.slice()，和数组的 slice 相似

我们可以使用这个方法获取文件的某一部分的片段不懂的同学可以去补补课,文件切片后，我们将这些切片进行并发发给服务端，由服务端进行合并，因为是并发，所以传输的顺序肯定是会变的，所以这个时候我们需要去记录片段的顺序，以便服务端去合并

## 实现

```js
function sliceFile(file, piece = 1024 * 1024 * 5) {
  let totalSize = file.size; // 文件总大小

  let start = 0; // 每次上传的开始字节
  let end = start + piece; // 每次上传的结尾字节
  let chunks = [];

  while (start < totalSize) {
    // 根据长度截取每次需要上传的数据
    // File对象继承自Blob对象，因此包含slice方法
    let blob = file.slice(start, end);
    chunks.push(blob);
    start = end;

    end = start + piece;
  }
  return chunks;
}
```

```js
/**
 * 创建切片
 */
const createFileChunk = (file, size = 1024 * 10 * 1024) => {
  //定义一个数组用来存储每一份切片
  const fileChunkList = [];
  //存储索引，以cur和cur+size作为开始和结束位置利用slice方法进行切片
  let cur = 0;
  while (cur < file.size) {
    fileChunkList.push({ file: file.slice(cur, cur + size) });
    cur += size;
  }
  upload.total = fileChunkList.length;
  return fileChunkList;
};

/**
 * @description: 文件上传 Change 事件  选择文件
 * @param {*}
 * @return {*}
 */
const handleFileChange = async (file, files) => {
  console.log("[Log] file-->", file, files);
  upload.fileList = files;
  upload.currentFile = file;
  upload.name = file.name;
};
/**
 * @description: 文件上传 Click 事件
 * @param {*}
 * @return {*}
 */
const handleUploadFile = async () => {
  percentage.value = 0;
  controller = new AbortController();
  if (!upload.fileList.length) return;
  const fileChunkList = createFileChunk(upload.currentFile.raw); // 这里上传文件的时候进行分片
  // calculateHash ---- 计算hash
  const fileHash = await calculateHash(fileChunkList);
  // 获取后缀名
  let suffixName = upload.currentFile.name.split(".")[1];
  upload.currentFile.fileHashName = fileHash + "." + suffixName;
  upload.fileArr = fileChunkList.map(({ file }, index) => ({
    chunk: file,
    hash: fileHash + "." + suffixName + "_" + index, // 文件名  数组下标
  }));
  let result = await fileIsTransmission("http://localhost:8100/bigFile");
  console.log("[Log] result-->", result);
  if (result.code === 201) {
    handleUploadChunks();
  } else {
    ElMessageBox.alert("文件秒传成功", "文件上传", {
      confirmButtonText: "OK",
    });
  }
};
/**
 * 上传切片
 */
const handleUploadChunks = async () => {
  //设置请求头和监听上传的进度
  let configs = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    //设置超时时间
    timeout: 600000,
  };
  const requestList = upload.fileArr.map(({ chunk, hash }) => {
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("hash", hash);
    formData.append("filename", upload.currentFile.name);
    formData.append("total", upload.total);
    // console.log("[Log] formData-->", formData.get("hash")); // 直接打印formata是空的你需要使用get或者getAll的方法去打印
    return { formData };
  });

  let result = null;

  if (switchControl.value) {
    console.log("上面 ---- 并发");
    result = await ajax(
      "http://localhost:8100/bigFile",
      5,
      requestList,
      configs
    );
  } else {
    console.log("下面 ---- 遍历");
    result = await noConcurrency(
      "http://localhost:8100/bigFile",
      requestList,
      configs
    );
  }

  // return;
  if (result.code == 200) {
    let {
      data: { consumTime },
    } = await mergeRequest(upload.currentFile.fileHashName);
    console.log("[Log] consumTime-->", consumTime);
    timeLog.value.push({
      consumTime: consumTime,
      date: new Date().toLocaleString(),
      size: upload.currentFile.size,
    });
  }
};
```

```js
const upload = reactive({
  //文件列表
  fileList: [],
  //存储当前文件
  currentFile: null,
  //当前文件名
  name: "",
  //存储切片后的文件数组
  fileArr: [],
  //切片总份数
  total: 0,
  timeLog: [], // 耗时记录
});
```

### 生成 hash

无论是前端还是服务端，都必须要生成文件和切片的 hash，之前我们使用文件名 + 切片下标作为切片 hash，这样做文件名一旦修改就失去了效果，而事实上只要文件内容不变，hash 就不应该变化，所以正确的做法是根据文件内容生成 hash，所以我们修改一下 hash 的生成规则,所以上面我们使用了 spark-md5,它可以根据文件内容计算出文件的 hash 值。另外一个问题是如果文件过大，可能会导致计算 hash 进行 ui 阻塞，导致页面假死，其实我们这边可以使用 web-worker 方法进行去计算不懂的同学可以去补补课 我这边就不实现了

```js
/**
 * 使用spark-md5计算hash
 */
const calculateHash = function (fileChunkList) {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();
    const file = fileChunkList;
    // 文件大小
    const size = upload.currentFile.size;
    let offset = 2 * 1024 * 1024;
    let chunks = [file.slice(0, offset)];
    // 前面100K
    let cur = offset;
    while (cur < size) {
      // 最后一块全部加进来[]
      if (cur + offset >= size) {
        chunks.push(file.slice(cur, cur + offset));
      } else {
        // 中间的 前中后去两个字节
        const mid = cur + offset / 2;
        const end = cur + offset;
        chunks.push(file.slice(cur, cur + 2));
        chunks.push(file.slice(mid, mid + 2));
        chunks.push(file.slice(end - 2, end));
      }
      // 前取两个字节
      cur += offset;
    }
    // 拼接
    reader.readAsArrayBuffer(new Blob(chunks));
    reader.onload = (e) => {
      spark.append(e.target.result);
      resolve(spark.end());
    };
  });
};
```

## 文件秒传

这个功能的意思就是说，我们在文件上传之前，去问一下服务器，你有没有这个文件呀，你没有的话我就开始上传，你要是有的话我就偷个懒，用你有的我就不上传了。
所以需要实现一个检测接口(verify)，去询问服务器有没有这个文件，因为我们之前是计算过文件的 hash 的，能保证文件的唯一性。就用这个 hash 就能唯一的判断这个文件。所以这个接口的思路也很简单，就是判断我们的 target 目录下是否存在这个文件。上面我们计算了 hash 即使你改了文件名我一样知道 hash 值，根据 hash 和后缀名我就知道文件有没有了

## 断点续传

针对这些问题，所以我对代码进行了改动我把上传的所有切片用一个全局变量去存储 requestList，后端因为对于每个分片都去成功返回成功的代码，所以当我暂停传的时候会接收到最开始的状态码，我拿到状态码根据文件名获得 index,利用 index 去 splice 数组 requestList 就可以了。
