# ModuleJS

### 介绍
ModuleJS，是一个遵循GMD、CMD、AMD、UMD规范的js模块管理

### 文件大小
|文件名|文件大小|文件说明|
|--|--|--|
|require.min.js.zip|1.15k|js代码压缩 + zip压缩，用于网络要求更高的生产运营环境|
|require.min.js|2.4k|js代码压缩，用于生产运营时使用|
|require.js|7.3k|js源代码，用于开发测试时使用|

### 通过return导出模块

```
define(function(){
    return ... //导出任意数据类型的模块
})
```

|全局变量模块的导入方式|是否支持|
|--|--|
|HTML Script|×|
|AMD规范/RequireJS|√|
|CMD规范|×|
|CommonJS规范|×|
|ES Module规范|×|
|ModuleJS|√|


### 通过exports导出模块


1. 通过define默认参数的exports导出模块

```
define(function(require, exports, module){
    //规定导出exports对象类型的模块
    exports.sayHello = ... //在即将导出exports对象上加成员
})
```

2. 通过define指定参数的exports导出模块

```
define(["exports"], function(exports){
    //规定导出exports对象类型的模块
    exports.sayHello = ... //在即将导出exports对象上加成员
})
```

|全局变量模块的导入方式|是否支持|
|--|--|
|HTML Script|×|
|AMD规范/RequireJS|√|
|CMD规范|×|
|CommonJS规范|×|
|ES Module规范|×|
|ModuleJS|√|


3. 通过默认变量exports导出模块

```
exports.sayHello = ... //在即将导出exports对象上加成员
```

|全局变量模块的导入方式|是否支持|
|--|--|
|HTML Script|×|
|AMD规范/RequireJS|×|
|CMD规范|×|
|CommonJS规范|√|
|ES Module规范|×|
|ModuleJS|×|


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

3. CommonJS规范

```
module.exports = ... //导出任意数据类型的模块
```

### 通过全局变量导出模块

```
(
    (typeof window == "object" && window) ||
    (typeof global == "object" && global)
).myModule = ... //导出任意数据类型的模块
```

|全局变量模块的导入方式|是否支持|
|--|--|
|HTML Script|√|
|AMD规范/RequireJS|√|
|CMD规范|√|
|CommonJS规范|√|
|ES Module规范|√|
|ModuleJS|√|


### 通过UMD规范导出模块


```
((root, factory) => {
    if (typeof define === "function" && define.amd) {
        //AMD
        define(["dependentModule1", "dependentModule2"...], factory);
    } else if (typeof exports === 'object') {
        //CommonJS
        module.exports = factory(requie("dependentModule1"), requie("dependentModule2")...);
    } else {
        root.currentModule = factory(root.dependentModule1, root.dependentModule2);
    }
})(
    (typeof window == "object" && window) || (typeof global == "object" && global), 
    (dependentModule1, dependentModule2...) => {
        //todo
    }
)
```

|UMD模块的导入方式|是否支持|
|--|--|
|HTML Script|√|
|AMD规范/RequireJS|√|
|CMD规范|√|
|CommonJS规范|√|
|ES Module规范|√|
|ModuleJS|√|
|RequireJS + HTML Script|×|
|ModuleJS + HTML Script|√|


### 子模块

```
define(["module1", "module2"], function(module1, module2){
    var mainModule = { module1:module1, module2:module2 };
    return mainModule;
})
```


```
define(["require"], function(require){
    
})
```


```
define(["require"], function(){
    
})
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
        加载异步模块中...
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
        加载异步模块中...
    </body>
</html>
```

> 代码文件：/example/sync-load-cmd-module-exmaple.html

