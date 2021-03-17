# SiliqueJS

### 介绍
SiliqueJS，是一个同时兼容CommonJS、CMD、AMD、UMD等规范的js模块管理

### AMD规范

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

### CMD规范

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

