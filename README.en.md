# ModuleJS

### Introduction
ModuleJS is a js module management compatible with CMD, AMD, UMD specifications.

### File size
|File name|File size|File description|
|--|--|--|
|module.min.js.zip|1.15k|js code compression + zip compression for production and operation environments with higher network requirements|
|module.min.js|2.4k|js code compression, used in production operations|
|module.js|7.3k|js source code, used for development and testing|

### define module

1. Define the module
```
define(function(){
    ...
})
```

2. Define the alias module
```
define("myModule.js",[],function(){
    ...
})
```


### Export module

1. Return export module
```
define(function(){
    return ... //Return modules of any data type
})
```

2. exports export module

-Depends on exports export module by default
```
define(function(require, exports, module){
    exports.sayHello = ...
})
```

-Specify dependent exports to export modules

```
define(["exports"], function(exports){
    exports.sayHello = ...
})
```

3. module.exports export module

-The default export module depends on module.exports
```
define(function(require, exports, module){
    module.exports = ...
})

```
-Specify the dependent module.exports to export the module

```
define(["exports"], function(exports){
    module.exports = ...
})
```

4. Global variable export module

```
(
    (typeof window == "object" && window) ||
    (typeof global == "object" && global)
).myModule = ... //Export modules of any data type
```



### Import module

1. Import modules synchronously

-Import a single module simultaneously
```
var myModule = require("myModule.js");
```
or
```
var myModule = require("myModule.js", false);
```

-Import multiple modules simultaneously
```
var myModule1 = require("myModule1.js");
var myModule2 = require("myModule2.js");
```
or
```
var myModule1 = require("myModule1.js", false);
var myModule2 = require("myModule2.js", false);
```

2. Import modules asynchronously

-Import a single module asynchronously
```
require("myModule.js", function(myModule){
    ...
})
```
or
```
var myModulePromise = require("myModule.js", true);
myModulePromise.then(function(myModule){
    ...
})
```

-Import multiple modules asynchronously
```
require(["myModule1.js"...], function(myModule1...){
    ...
})
```
or
```
var myModulesPromise = require(["myModule1.js"...], true);
myModulesPromise.then(function(modules){
    var myModule1 = modules[0];
    ...
})
```


### Dependent module

1. Import dependent modules in advance
```
define(["dependentModule1.js"...], function(dependentModule1...){
    var mainModule = {
        subMudle1: dependentModule1
    };
    
    return mainModule;
})
```

2. Import the synchronization dependency module after the push

```
define(function(){
    var mainModule = {
        subMudle1: require("dependentModule1.js")
    };

    return mainModule;
})
```

3. Import asynchronous dependent modules after the push
```
define(function(){
    var mainModule = {};

    return require(["dependentModule1.js"...], function(dependentModule1...){
        mainModule.dependentModule1 = dependentModule1;
        return mainModule;
    })
})
```




### AMD specification example

> AMD specification refers to the asynchronous module definition (Asynchronous Module Definition), that is, the module is loaded asynchronously

AMD specification defines modules:

```
define(function(){

    return function(text){
        setTimeout(function(){
            document.body.innerText = text;
        }, 100);
    }

})
```
> Code file: /example/print-amd-module.js

```
define(["print-amd-module.js"], function(print){

    return {
        sayHello:function()
        {
            print("Hi, the module defined by my AMD specification");
        }
    }

})
```
> Code file: /example/hello-amd-module.js



Asynchronously load the modules defined by the AMD specification:

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
        Loading asynchronous module...
    </body>
</html>
```
> Code file: /example/async-load-amd-module-exmaple.html

### CMD specification example

> CMD specification refers to the Common Module Definition, that is, the module is loaded in a synchronous manner

CMD specification definition module:

```
define(function(require, exports, module){

    module.exports = function(text){
        setTimeout(function(){
            document.body.innerText = text;
        }, 100);
    }

})
```
> Code file: /example/print-cmd-module.js

```
define(function(require, exports, module){
    
    exports.sayHello = function(){
        var print = require("print-cmd-module.js");
        print("Hi, the module defined by my CMD specification");
    }

})
```
> Code file: /example/hello-cmd-module.js

Synchronously load the modules defined by the CMD specification:

```
<html>
    <head>
        <script>
            var helloAmdModule = require(["hello-cmd-module.js"]);
            helloAmdModule.sayHello();
        </script>
    </head>
    <body>
        Loading asynchronous module...
    </body>
</html>
```

> Code file: /example/sync-load-cmd-module-exmaple.html


### CMD specification example

```
((root, factory) => {
    if (typeof define === "function" && define.amd) {
        //AMD
        define(["dependentModule1", "dependentModule2"...], factory);
    } else if (typeof exports ==='object') {
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
