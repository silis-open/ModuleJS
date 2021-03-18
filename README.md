# ModuleJS

### 介绍
ModuleJS，是一个同时兼容CMD、AMD、UMD规范的js模块管理

### 文件大小
|文件名|文件大小|文件说明|
|--|--|--|
|require.min.js.zip|1.15k|js代码压缩 + zip压缩，用于网络要求更高的生产运营环境|
|require.min.js|2.4k|js代码压缩，用于生产运营时使用|
|require.js|7.3k|js源代码，用于开发测试时使用|

### 通过return导出模块

> 属于AMD规范

```
define(function(){
    return ... //导出任意数据类型的模块
})
```

### 通过exports导出模块

1. 
```
define(function(require, exports, module){
    //规定导出exports对象类型的模块
    exports.sayHello = ... //在即将导出exports对象上加成员
})
```

2. 
```
define(["exports"], function(exports){
    //规定导出exports对象类型的模块
    exports.sayHello = ... //在即将导出exports对象上加成员
})
```

3.

```
exports.sayHello = ... //在即将导出exports对象上加成员
```


### 通过module.exports导出模块

1. 
```
define(function(require, exports, module){
    module.exports = ... //导出任意数据类型的模块
})
```

2. 
```
define(["module"], function(module){
    module.exports = ... //导出任意数据类型的模块
})
```

3.

```
module.exports = ... //导出任意数据类型的模块
```


### AMD规范示例

> AMD规范指异步模块定义（Asynchronous Module Definition），即通过异步方式加载模块

AMD规范定义模块：

```
define(function(){

    return function(text){
        setTimeout(function(){
            document.body.innerText = text;
        }, 100);
    }

})
```
> 代码文件：/example/print-amd-module.js

```
define(["print-amd-module.js"], function(print){

    return {
        sayHello:function()
        {
            print("Hi，我的AMD规范定义的模块");
        }
    }

})
```
> 代码文件：/example/hello-amd-module.js



异步方式加载AMD规范定义的模块：

```
<html>
    <head>
        <script>
            require(["hello-amd-module.js"], function(helloAmdModule){
                helloAmdModule.sayHello();
            })
        </script>
    </head>
    <body>
        加模异步模块中...
    </body>
</html>
```
> 代码文件：/example/async-load-amd-module-exmaple.html

### CMD规范示例

> CMD规范指同步模块定义（Common Module Definition），即通过同步方式加载模块

CMD规范定义模块：

```
define(function(require, exports, module){

    module.exports = function(text){
        setTimeout(function(){
            document.body.innerText = text;
        }, 100);
    }

})
```
> 代码文件：/example/print-cmd-module.js

```
define(function(require, exports, module){
    
    exports.sayHello = function(){
        var print = require("print-cmd-module.js");
        print("Hi，我的CMD规范定义的模块");
    }

})
```
> 代码文件：/example/hello-cmd-module.js

同步方式加载CMD规范定义的模块：

```
<html>
    <head>
        <script>
            var helloAmdModule = require(["hello-cmd-module.js"]);
            helloAmdModule.sayHello();
        </script>
    </head>
    <body>
        加模异步模块中...
    </body>
</html>
```

> 代码文件：/example/sync-load-cmd-module-exmaple.html

