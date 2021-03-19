# ModuleJS

### 介绍
ModuleJS，是一个兼容CMD、AMD、UMD规范的js模块管理。

### 文件大小
|文件名|文件大小|文件说明|
|--|--|--|
|module.min.js.zip|1.15k|js代码压缩 + zip压缩，用于网络要求更高的生产运营环境|
|module.min.js|2.4k|js代码压缩，用于生产运营时使用|
|module.js|7.3k|js源代码，用于开发测试时使用|

### 定义模块（define module）

1. 定义模块
```
define(function(){
    ...
})
```

2. 定义别名模块
```
define("myModule.js",[],function(){
    ...
})
```


### 导出模块（export module）

1. return导出模块
```
define(function(){
    return ... //返回任意数据类型的模块
})
```

2. exports导出模块

- 默认依赖exports导出模块
```
define(function(require, exports, module){
    exports.sayHello = ...
})
```

- 指定依赖exports导出模块

```
define(["exports"], function(exports){
    exports.sayHello = ...
})
```

3. module.exports导出模块

- 默认依赖module.exports导出模块
```
define(function(require, exports, module){
    module.exports = ...
})

```
- 指定依赖module.exports导出模块

```
define(["exports"], function(exports){
    module.exports = ...
})
```

4. 全局变量导出模块

```
(
    (typeof window == "object" && window) ||
    (typeof global == "object" && global)
).myModule = ... //导出任意数据类型的模块
```



### 导入模块（import module）

1. 同步导入模块

- 同步导入单个模块
```
var myModule = require("myModule.js");
```
或
```
var myModule = require("myModule.js", false);
```

- 同步导入多个模块
```
var myModule1 = require("myModule1.js");
var myModule2 = require("myModule2.js");
```
或
```
var myModule1 = require("myModule1.js", false);
var myModule2 = require("myModule2.js", false);
```

2. 异步导入模块

- 异步导入单个模块
```
require("myModule.js", function(myModule){
    ...
})
```
或
```
var myModulePromise = require("myModule.js", true);
myModulePromise.then(function(myModule){
    ...
})
```

- 异步导入多个模块
```
require(["myModule1.js"...], function(myModule1...){
    ...
})
```
或
```
var myModulesPromise = require(["myModule1.js"...], true);
myModulesPromise.then(function(modules){
    var myModule1 = modules[0];
    ...
})
```


### 依赖模块（dependent module）

1. 提前导入依赖模块
```
define(["dependentModule1.js"...], function(dependentModule1...){
    var mainModule = {
        subMudle1: dependentModule1
    };
    
    return mainModule;
})
```

2. 推后导入同步依赖模块

```
define(function(){
    var mainModule = {
        subMudle1: require("dependentModule1.js")
    };

    return mainModule;
})
```

3. 推后导入异步依赖模块
```
define(function(){
    var mainModule = {};

    return require(["dependentModule1.js"...], function(dependentModule1...){
        mainModule.dependentModule1 = dependentModule1;
        return mainModule;
    })
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


### CMD规范示例

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

