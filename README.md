# require

#### 介绍
requireJSX，是一个同时兼容commonJS、CMD、AMD、UMD等规范的js模块管理

#### AMD规范

> AMD规范指异步模块定义(Asynchronous Module Definition)，即通过异步方式加载模块

AMD规范定义的模块：

```
define(["print-amd-module.js"], function(print){
    return {
        print("Hi，我的AMD规范定义的模块");
    }
})
```
> 代码文件：/example/hello-amd-module.js


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



异步方式加载AMD规范定义的模块：

```
<html>
    <head>
    require(["hello-amd-module.js"], function(myAmdModule){
        myAmdModule.sayHello();
    })
    </head>
    <body>
        加模异步模块中...
    </body>
</html>
```
> 代码文件：/example/async-load-amd-module-exmaple.html


#### commonJS

#### CMD规范

CMD规范定义的模块：
```
define(function(){
    return {
        setTimeout(function(){
            document.body.innerText = "Hi，我的AMD规范定义的模块";
        }, 100);
    }
})
```
